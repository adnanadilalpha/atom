// ATOM Edge Runtime - Lightweight runtime for edge functions
// Compatible with Cloudflare Workers, Vercel Edge, and similar platforms

/**
 * Edge Runtime API - Subset of Web APIs available in edge environments
 * This provides compatibility layer for edge functions
 */

class EdgeRequest {
    constructor(request, url, method, headers, body) {
        this.request = request;
        this.url = url;
        this.method = method;
        this.headers = headers;
        this.body = body;
        this.path = new URL(url).pathname;
        this.query = Object.fromEntries(new URL(url).searchParams);
    }

    json() {
        return Promise.resolve(this.body ? JSON.parse(this.body) : {});
    }

    text() {
        return Promise.resolve(this.body || '');
    }
}

class EdgeResponse {
    constructor(body, init = {}) {
        this.body = body;
        this.status = init.status || 200;
        this.statusText = init.statusText || 'OK';
        this.headers = new Map(Object.entries(init.headers || {}));
    }

    json(data) {
        this.body = JSON.stringify(data);
        this.headers.set('Content-Type', 'application/json');
        return this;
    }

    text(data) {
        this.body = String(data);
        this.headers.set('Content-Type', 'text/plain');
        return this;
    }

    html(data) {
        this.body = String(data);
        this.headers.set('Content-Type', 'text/html');
        return this;
    }

    redirect(url, status = 302) {
        this.status = status;
        this.headers.set('Location', url);
        return this;
    }

    setHeader(name, value) {
        this.headers.set(name, value);
        return this;
    }
}

/**
 * Edge Middleware Handler
 * Processes requests in edge-compatible way
 */
function createEdgeHandler(middlewareFn) {
    return async (request, env, ctx) => {
        const url = request.url;
        const method = request.method;
        const headers = {};
        request.headers.forEach((value, key) => {
            headers[key] = value;
        });
        
        const body = method !== 'GET' && method !== 'HEAD' 
            ? await request.text() 
            : null;

        const edgeReq = new EdgeRequest(request, url, method, headers, body);
        const edgeRes = new EdgeResponse();

        // Call user middleware
        try {
            await middlewareFn(edgeReq, edgeRes);
            
            // Convert to Response
            const responseInit = {
                status: edgeRes.status,
                statusText: edgeRes.statusText,
                headers: Object.fromEntries(edgeRes.headers)
            };

            return new Response(edgeRes.body, responseInit);
        } catch (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };
}

/**
 * Edge Function Wrapper
 * Wraps server functions for edge execution
 */
function createEdgeFunction(serverFn) {
    return async (request, env, ctx) => {
        const url = new URL(request.url);
        const body = request.method === 'POST' 
            ? await request.json() 
            : {};

        try {
            const result = await serverFn(body);
            return new Response(JSON.stringify(result), {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };
}

module.exports = {
    EdgeRequest,
    EdgeResponse,
    createEdgeHandler,
    createEdgeFunction
};

