// ATOM Edge Deployment - Cloudflare Workers, Vercel Edge, etc.

/**
 * Generate Cloudflare Workers deployment file
 */
function generateCloudflareWorker(serverFunctions, middleware) {
    return `
// ATOM Edge Function for Cloudflare Workers
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        
        // Handle static assets
        if (path.startsWith('/_atom/')) {
            return handleSystemRoute(request, env);
        }
        
        // Handle middleware
        ${middleware ? `
        const edgeReq = {
            url: request.url,
            method: request.method,
            headers: Object.fromEntries(request.headers),
            path: path,
            query: Object.fromEntries(url.searchParams),
            json: async () => await request.json(),
            text: async () => await request.text()
        };
        
        const edgeRes = {
            status: 200,
            headers: new Headers(),
            json: (data) => new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } }),
            text: (data) => new Response(data, { headers: { 'Content-Type': 'text/plain' } }),
            html: (data) => new Response(data, { headers: { 'Content-Type': 'text/html' } }),
            redirect: (url, status = 302) => Response.redirect(url, status),
            setHeader: (name, value) => { edgeRes.headers.set(name, value); }
        };
        
        await ${middleware}(edgeReq, edgeRes);
        if (edgeRes.headers.get('Location')) {
            return Response.redirect(edgeRes.headers.get('Location'), edgeRes.status);
        }
        ` : ''}
        
        // Handle SSR
        return handleSSR(request, env);
    }
};

async function handleSystemRoute(request, env) {
    const url = new URL(request.url);
    
    // RPC Bridge
    if (url.pathname.startsWith('/_atom/rpc/')) {
        const funcName = url.pathname.split('/').pop();
        const body = await request.json();
        const func = ${serverFunctions}[funcName];
        if (func) {
            try {
                const result = await func(body);
                return new Response(JSON.stringify(result), {
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (e) {
                return new Response(JSON.stringify({ error: e.message }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }
        return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    }
    
    return new Response('Not found', { status: 404 });
}

async function handleSSR(request, env) {
    // SSR would need to be implemented with edge-compatible rendering
    // For now, return basic HTML
    return new Response('<!DOCTYPE html><html><head><title>ATOM Edge</title></head><body><div id="root">Edge Function Active</div></body></html>', {
        headers: { 'Content-Type': 'text/html' }
    });
}
`;
}

/**
 * Generate Vercel Edge Function
 */
function generateVercelEdge(middleware) {
    return `
// ATOM Edge Function for Vercel
export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    const url = new URL(req.url);
    const path = url.pathname;
    
    ${middleware ? `
    const edgeReq = {
        url: req.url,
        method: req.method,
        headers: Object.fromEntries(req.headers),
        path: path,
        query: Object.fromEntries(url.searchParams),
        json: async () => await req.json(),
        text: async () => await req.text()
    };
    
    const edgeRes = {
        status: 200,
        headers: new Headers(),
        json: (data) => new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } }),
        text: (data) => new Response(data, { headers: { 'Content-Type': 'text/plain' } }),
        html: (data) => new Response(data, { headers: { 'Content-Type': 'text/html' } }),
        redirect: (url, status = 302) => Response.redirect(url, status),
        setHeader: (name, value) => { edgeRes.headers.set(name, value); }
    };
    
    await ${middleware}(edgeReq, edgeRes);
    ` : ''}
    
    return new Response('ATOM Edge Function', {
        headers: { 'Content-Type': 'text/html' }
    });
}
`;
}

module.exports = {
    generateCloudflareWorker,
    generateVercelEdge
};

