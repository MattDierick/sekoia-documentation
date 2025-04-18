import { Teleport, createApp, reactive } from "vue";
import { fetch_and_merge_openapi_schemas } from "./openapi/openapi"
import { Examples } from "./Examples";
import { tagEncode, Chevron, debounce, scrollToAnchor, capitalize } from "./utils"
import { Markdown } from "./Markdown"
import { Parameters } from "./Parameters"
import { Response } from "./Response"
import { Error } from "./Error"
import { Filter } from "./Filter"
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import hljsVuePlugin from "@highlightjs/vue-plugin";
import 'highlight.js/styles/a11y-dark.css'
import { toRaw } from "vue";

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('json', json);

import "./style.scss";
import './OpenAPIViewer.scss'
import { watch } from "@vue/reactivity";

/** Holds all reactive rendering context */
export const data = reactive({
    openapi_urls: [],
    region: (new URLSearchParams(location.search).get("region") || "fra1").toLowerCase(),
    api_key: "",
    selectedTags: [],
    loading: true,
    search: "",
})

export const OpenAPIViewer = {

    /** Gather all openapi.json/swagger.json manifests from {urls} and render as OpenAPIViewer Vue component */
    async init({ title, urls, menu, intro, regions, tag_mappings = {} }) {
        const hash = location.hash
        data.title = title

        // Mount Vue component
        const app = createApp(OpenAPIViewer);
        app.use(hljsVuePlugin)
        data.quickStart = document.querySelector("main article")
        const container = document.createElement("article")
        container.classList.add("md-content__inner")
        container.classList.add("md-typeset")
        container.id = 'openapi'
        data.quickStart.parentElement.appendChild(container)
        app.mount(container);

        const started_at = new Date()
        data.menu = menu;
        data.intro = intro;
        data.regions = regions;

        // Replace URLs with the selected region's URLs
        if (data.region !== "fra1") {
            urls = urls.map((url) =>
                url.replace("https://app.sekoia.io/", `https://app.${data.region}.sekoia.io/`)
            );
        }
        // Incorporate context queryparam
        urls = urls.map(url => url.replace("context=public", `context=${(new URLSearchParams(location.search).get('context') || 'public').toLowerCase()}`))
        data.openapi_urls = urls;

        // Retrieve and merge the OpenAPI 3.1 schemas
        data.schema = await fetch_and_merge_openapi_schemas(urls)
        window.schema = data.schema

        data.schema["x-tagGroups"] = menu;

        if (data.region !== "fra1")
            data.schema.servers[0].url = `https://app.${data.region}.sekoia.io/api`;

        // Flatten endpoints list
        data.endpoints = []
        Object.entries(data.schema.paths).forEach(([path, endpoints]) => {
            Object.entries(endpoints).forEach(([method, endpoint]) => {
                if (method === "parameters") return;
                data.endpoints.push({ ...endpoint, path, method })
            })
        })

        // Translate tags via tag_mappings defined in developer/api.md
        // e.g. { "User": "Account" } will replace all "User" tags with "Account"
        // e.g. { ["User", "Account"]: ["bla", "blu"] } will replace replace the ["User", "Account"] tags pair with ["bla", "blu"]
        //        (only if both tags are present in the endpoint)
        data.endpoints.forEach(endpoint => {
            const endpoint_tags = new Set(endpoint.tags || [])
            Object.entries(tag_mappings || {}).forEach(([tag, mapping]) => {
                mapping = Array.isArray(mapping) ? mapping : [mapping]
                const tags = Array.isArray(tag) ? tag : [tag]
                if (tags.every(t => endpoint_tags.has(t))) {
                    endpoint.tags = Array.from(new Set([...endpoint.tags.filter(t => !tags.includes(t)), ...mapping]))
                }
            })
        })

        // Organize endpoints according to the menu tree
        // and collect non-menu tags as filtering candidates
        data.tags = new Set()
        data.tagLevel = {}
        data.tree = []
        for (const tagGroup of menu) {
            const node = { name: tagGroup.name, children: [] }
            data.tree.push(node)
            for (const tag of tagGroup.tags) {
                node.children.push({ name: tag, endpoints: [] })
            }
        }

        for (const endpoint of data.endpoints) {
            endpoint.menu0 = data.tree.find(({ name }) => endpoint.tags.find(t => name.toLowerCase() === t.toLowerCase()))
            endpoint.menu1 = endpoint.menu0?.children.find(({ name }) => endpoint.tags.find(t => name.toLowerCase() === t.toLowerCase()))
            // If we couldn't a menu entry with a top-level tag, fallback to the first matching level-1 entry
            if (!endpoint.menu0 || !endpoint.menu1)
                data.tree.forEach(l0 => {
                    for (const l1 of l0.children) {
                        if (endpoint.tags.find(t => l1.name.toLowerCase() === t.toLowerCase())) {
                            endpoint.menu0 = l0
                            endpoint.menu1 = l1
                            return;
                        }
                    }
                })
            // If even the fallback level1 fails, raise a warning and skip the endpoint
            if (!endpoint.menu0 || !endpoint.menu1) {
                console.warn(`No menu entry for ${endpoint.tags}`, endpoint)
                continue
            }
            endpoint.menu1.endpoints.push(endpoint)
            endpoint.otherTags = new Set(endpoint.tags.filter(t => (
                t.toLowerCase() !== endpoint.menu0.name.toLowerCase() &&
                t.toLowerCase() !== endpoint.menu1.name.toLowerCase()
            )))
            endpoint.otherTags.forEach(t => data.tags.add(t))
        }
        data.tags = Array.from(data.tags).sort()


        // Apply filters
        function update() {
            data.loading = true
            const selectedTags = new Set(data.selectedTags)

            for (const endpoint of data.endpoints) {
                endpoint.visible = true;

                // Search filtering
                if (data.search && ![
                    endpoint.summary,
                    endpoint.description,
                    endpoint.title,
                    endpoint.name,
                    endpoint.path,
                ].some(x => x?.toLowerCase()?.includes(data.search))) {
                    endpoint.visible = false
                    continue;
                }

                // Tag filtering
                if (selectedTags.size > 0) {
                    if (!endpoint.otherTags?.size > 0 || selectedTags.isDisjointFrom(endpoint.otherTags))
                        endpoint.visible = false;
                }
            }

            setTimeout(() => data.loading = false, 10)
        }
        OpenAPIViewer.updateAsap = debounce(update, 500)
        watch(() => data.search, OpenAPIViewer.updateAsap)
        update()

        /** Called when the window is scrolled to sync the selected menu item */
        function updateScroll() {
            const el = getVisibleEndpoint()
            const [_, tag, ep] = el.id.split("/")
            if (el.id.includes("/") && tag) {
                data.cur1 = tag
                data.cur2 = el.id
                data.cur0 = data.menu?.find(tg => tg.tags?.includes(tag))?.name
                const hash = "#" + el.id
                if (hash !== location.hash) history.replaceState(null, '', window.location.href.split('#')[0] + hash)
                setImmediate(animateAccordion)
            } else {
                data.cur2 = location.hash.substring(1)
                const [_, tag] = data.cur2.split("/")
                data.cur1 = tag
                data.cur0 = data.menu?.find(tg => tg.tags?.includes(tag))?.name
            }
        }

        function getVisibleEndpoint() {
            let el = document.elementFromPoint(window.innerWidth * 0.6, 150)
            while (!el.id && el.parentElement) el = el.parentElement
            return el
        }

        /** Expand active menu items and collapse inactive ones */
        function animateAccordion() {
            document.querySelectorAll("#openapi-viewer .menu li.accordion").forEach(e => {
                const ul = e.querySelector("&>ul")
                if (e.classList.contains("active")) ul.style.maxHeight = `${ul.children[ul.children.length - 1]?.getBoundingClientRect()?.bottom || 0 - ul?.getBoundingClientRect()?.top || 0}px`
                else ul.style.maxHeight = "0px"
            })
        }

        // Called after the whole API doc's DOM has been rendered
        function afterRender() {
            // Scroll to the hash passed in the URL (after full rendering of the API doc)
            location.hash = hash
            scrollToAnchor(location.hash)
            data.loading = false;
            console.log("Doc rendered in", (new Date() - started_at) + "ms")

            // Register scroll listener
            setTimeout(() => {
                updateScroll()
                document.addEventListener("scroll", updateScroll)
            }, 500)
        }

        setTimeout(afterRender, 50)
    },

    setup(props) {
        // Scroll to top before filling the doc's DOM
        setImmediate(() => window.scrollTo({ top: 0, behavior: "instant" }))

        /** Toggles a tag filter */
        const toggleTag = (t) => {
            if (data.selectedTags.includes(t)) data.selectedTags = data.selectedTags.filter(tag => tag !== t)
            else data.selectedTags.push(t)
            OpenAPIViewer.updateAsap()
        }

        function closeMenu() {
            if (window.innerWidth >= 1000) return;
            setTimeout(() => {
                document.querySelector("#openapi-viewer .menu").classList.add("hidden")
                document.querySelector("#openapi-viewer .menu-bg").classList.add("hidden")
                document.querySelector("#openapi-viewer .menu-open").classList.add("show")
            }, 100)
        }

        function openMenu() {
            if (window.innerWidth >= 1000) return;
            setTimeout(() => {
                document.querySelector("#openapi-viewer .menu").classList.remove("hidden")
                document.querySelector("#openapi-viewer .menu-bg").classList.remove("hidden")
                document.querySelector("#openapi-viewer .menu-open").classList.remove("show")
            }, 100)
        }

        return () => {
            return <>
                {data.loading && <Teleport to="main"><div class="loading" /></Teleport>}

                <div id="openapi-viewer" class='wrapper'>

                    <div class="menu-bg" onClick={closeMenu}></div>
                    <button class="menu-open" onClick={openMenu}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"></path></svg>
                    </button>
                    <button class="menu-close" onClick={openMenu}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"></path></svg>
                    </button>

                    <div class="menu">
                        <div class="select-region">
                            <label>Select region</label>
                            <select class='doc-input' onChange={({ target }) => location.search = `?region=${target.value}`}>
                                {data.regions?.map(r => <option selected={r.toUpperCase() === data.region?.toUpperCase()}>
                                    {r}
                                </option>)}
                            </select>
                        </div>

                        <div class="search">
                            <input class='doc-input' name="search-api" onInput={({ target }) => data.search = target.value} value={data.search} placeholder="Search API" />
                        </div>

                        <Filter items={data.tags} selection={data.selectedTags} onClick={toggleTag} separator=" - " placeholder="Search tags">Filter tags</Filter>




                        <ul class="scroll-container md-nav__list" class={{ loading: data.loading }}>
                            <ul class="menu-intro">
                                {data.intro?.map(name => <li class='md-nav__item' class={{
                                    active: data.cur1 === tagEncode(name),
                                }}>
                                    <a href={`#${tagEncode(name.toLowerCase())}`} >{capitalize(name)}</a>
                                </li>)}
                            </ul>

                            {data.loading && <div class="loader"><div class="ui-spinner" /> Loading APIs ...</div>}

                            {data.tree?.map(({ name, children }) => <li class="md-nav__item md-nav__item--nested" class={{
                                active: data.cur0 === tagEncode(name),
                            }}>
                                <a href={`#tag/${tagEncode(name)}`}>{name}</a>
                                <ul class='md-nav__list'>
                                    {children?.map(({ name, endpoints }) => <li class='md-nav__item md-nav__item--nested accordion' class={{
                                        active: data.cur1 === tagEncode(name),
                                        empty: !endpoints?.filter(e => e.visible)?.length > 0
                                    }}>
                                        <a href={`#tag/${tagEncode(name)}`} >{capitalize(name)} {Chevron}</a>
                                        <ul class='md-nav__list'>
                                            {endpoints?.map(({ operationId, method, summary, visible = true }) => !!visible && <li class='md-nav__item md-nav__item--nested' class={{
                                                active: data.cur2 === `tag/${tagEncode(name)}/${operationId}`
                                            }}>
                                                <a href={`#tag/${tagEncode(name)}/${operationId}`} onClick={closeMenu}>
                                                    <span class='method' class={method}>{method}</span>
                                                    <span>{summary || operationId}</span>
                                                </a>
                                            </li>)}
                                        </ul>
                                    </li>)}
                                </ul>
                            </li>)}
                        </ul>
                    </div>


                    <div class="content">
                        <h1>{data.title}</h1>

                        <a href="#" onClick={() => {
                            const blob = new Blob([JSON.stringify(window.schema, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'schema.json';
                            a.click();
                            URL.revokeObjectURL(url);
                        }}
                            class='download-schema'
                        >
                            Download full OpenAPI 3.1 schema in JSON format
                        </a>

                        <h2 id="quickstart" class="sc-jXbUNg copjkU">Quickstart</h2>
                        <div class="quickstart" v-embed={data.quickStart} />

                        {data.tree?.map(({ name, children }) => <>
                            <a href={`#tag/${tagEncode(name)}`}>
                                <h2 id={`tag/${tagEncode(name)}`}>
                                    {name}
                                    <span class='alink' />
                                </h2>
                            </a>
                            {children?.map(({ name, endpoints }) => <>
                                <a href={`#tag/${tagEncode(name)}`} class={{ empty: !endpoints?.filter(e => e.visible)?.length > 0 }}>
                                    <h3 id={`tag/${tagEncode(name)}`}>
                                        {capitalize(name)}
                                        <span class='alink' />
                                    </h3>
                                </a>
                                {endpoints?.map(endpoint => !!endpoint.visible && Endpoint(
                                    `tag/${tagEncode(name)}/${endpoint.operationId}`,
                                    endpoint,
                                    name,
                                ))}
                            </>)}
                        </>)}

                    </div>

                </div >
            </>
        }
    },

    directives: {
        /** v-embed directive to embed a extraneous DOM component (used for quickstart) */
        embed: (el, { value }) => value && el.appendChild(value),
    }

}

/** Component that renders a single API endpoint */
const Endpoint = (id, endpoint, tag) => {
    // Extract permissions from description text
    let description = endpoint.description
    const permissions = description?.match(/The following permissions are required:\n(\s+-[^\n]+)+/)?.slice(1).map(p => {
        const [_, name, uuid, __, description] = p.match(/- \W*([\w\s]*)\W* \(`([^`]+)`\)(:\s+(.*))?/) || []
        return { name, uuid, description }
    })
    description = description?.replace(/The following permissions are required:\n(\s+-[^\n]+)+/, "")
    const responses = Object.entries(endpoint.responses || {}).filter(([code]) => code < 400)
    const errors = Object.entries(endpoint.responses || {}).filter(([code]) => code >= 400)
    return <><div class='endpoint' id={id}>
        <div class="content">
            <a href={`#${id}`} onClick={() => console.log(toRaw(endpoint))}><h4 id={id}>
                <span class='method' class={endpoint.method}>{endpoint.method}</span>
                {endpoint.summary}
                <span class='alink' />
            </h4></a>

            {endpoint.tags?.length > 1 && <div class="tags"><label>Tags</label> {endpoint.tags.filter(t => t !== tag).map(t => <div class='tag'>{t}</div>)}</div>}

            <Markdown class='description' src={description} />

            {permissions?.length > 0 && <>
                <h5>Required permissions</h5>
                <div class="permissions-overflow-table">
                    <table class='permissions'>
                        {permissions?.map(({ name, uuid, description }) => <tr>
                            <td class='identifier'>{name}</td>
                            <td class='uuid'>{uuid}</td>
                            <td width="100%">{description}</td>
                        </tr>)}
                    </table>
                </div>
            </>}

            <h5>Parameters</h5>
            <Parameters endpoint={endpoint} />

            <h5>Responses</h5>
            {responses?.map(([code, response]) => <Response code={code} response={response} />)}

            {errors?.length > 0 && <>
                <h5>Error codes</h5>
                <div class='errors'>
                    {errors?.map(([code, response]) => <Error code={code} response={response} />)}
                </div>
            </>}

        </div>

        <div class="right">
            <Examples endpoint={endpoint} />
        </div>

    </div>
        <hr />
    </>

}

/** Resolve a $ref or a subschema inside the data.schema */
export function resolveSchema(schema) {
    if (!schema) return {};
    if (schema?.properties) return schema
    if (schema.schema) return resolveSchema(schema.schema)
    if (schema.$ref) return resolveSchema(schema.$ref)
    if (typeof (schema) !== "string") return {};
    if (!schema?.startsWith("#/")) return {};
    let el = data.schema
    schema.split("/").slice(1).forEach(part => el = el?.[part])
    return el || {}
}


window.OpenAPIViewer = OpenAPIViewer
