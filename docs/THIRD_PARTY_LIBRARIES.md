# Third-Party Libraries

ATOM Framework works seamlessly with any npm package. This guide covers how to use third-party libraries like GSAP, Framer Motion, and others in your ATOM applications.

## Overview

ATOM Framework supports:
- **Client-side libraries** - GSAP, Framer Motion, Three.js, etc.
- **Server-side libraries** - Database drivers, utilities, etc.
- **Universal libraries** - Works in both client and server
- **Automatic bundling** - esbuild handles all dependencies

## How It Works

ATOM Framework uses **esbuild** to bundle your code and dependencies. When you import an npm package, esbuild automatically:
1. Resolves the package from `node_modules`
2. Bundles it with your code
3. Handles tree-shaking and optimization
4. Creates optimized bundles for client and server

## Installing Libraries

Install any npm package as usual:

```bash
# Animation libraries
npm install gsap
npm install framer-motion

# Utility libraries
npm install lodash
npm install date-fns

# UI libraries
npm install react-icons  # Works with ATOM too!
npm install @headlessui/react
```

## Using Client-Side Libraries

### GSAP (GreenSock Animation Platform)

GSAP is perfect for animations in ATOM:

```atom
// app/home.atom
import { gsap } from 'gsap';

@View {
  const elementRef = useRef(null);
  
  useEffect(() => {
    if (elementRef.current) {
      // Animate on mount
      gsap.from(elementRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out"
      });
    }
  }, []);
  
  return div([
    h1("Animated Title", {
      ref: elementRef,
      className: "text-4xl font-bold"
    })
  ]);
}
```

### Advanced GSAP Example

```atom
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

@View {
  const [items, setItems] = useState([
    { id: 1, title: "Item 1" },
    { id: 2, title: "Item 2" },
    { id: 3, title: "Item 3" }
  ]);
  
  useEffect(() => {
    // Animate items on scroll
    items.forEach((item, index) => {
      const element = document.getElementById(`item-${item.id}`);
      if (element) {
        gsap.from(element, {
          opacity: 0,
          x: -100,
          duration: 0.8,
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        });
      }
    });
    
    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [items]);
  
  return div(
    items.map(item =>
      div([
        h2(item.title, {
          id: `item-${item.id}`,
          className: "text-2xl mb-4"
        })
      ], { className: "mb-8" })
    )
  );
}
```

### Framer Motion Alternative

Since Framer Motion is React-specific, use GSAP or create a similar API:

```atom
import { gsap } from 'gsap';

// Create a motion-like API
function motion(element, props) {
  if (props.initial) {
    gsap.set(element, props.initial);
  }
  
  if (props.animate) {
    gsap.to(element, {
      ...props.animate,
      duration: props.transition?.duration || 0.3
    });
  }
  
  return element;
}

@View {
  const elementRef = useRef(null);
  
  useEffect(() => {
    if (elementRef.current) {
      motion(elementRef.current, {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5 }
      });
    }
  }, []);
  
  return div([
    h1("Animated", {
      ref: elementRef,
      className: "text-4xl"
    })
  ]);
}
```

## Using Server-Side Libraries

### Database Libraries

```atom
@Resource DB from './db';
@Resource bcrypt from 'bcryptjs';

@Flow Actions {
  secure_createUser: async function(data) {
    // Use bcrypt for password hashing
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const result = await DB.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *',
      [data.email, hashedPassword]
    );
    
    return result.rows[0];
  }
};
```

### Utility Libraries

```atom
@Resource lodash from 'lodash';
@Resource moment from 'moment';

@Flow Actions {
  secure_processData: async function(data) {
    // Use lodash utilities
    const processed = lodash.groupBy(data.items, 'category');
    
    // Use moment for dates
    const formatted = moment().format('YYYY-MM-DD');
    
    return { processed, formatted };
  }
};
```

## Universal Libraries

Some libraries work in both client and server:

```atom
// app/utils.atom
import { format } from 'date-fns';

@View {
  const formattedDate = format(new Date(), 'PPP');
  return div(formattedDate);
}

// Also works in Server Actions
@Flow Actions {
  secure_getDate: async function() {
    const { format } = await import('date-fns');
    return format(new Date(), 'PPP');
  }
};
```

## Using Libraries in Components

### Reusable Animated Component

```atom
// app/_components/AnimatedCard.atom
import { gsap } from 'gsap';

@View {
  const { children, className = "" } = props || {};
  const cardRef = useRef(null);
  
  useEffect(() => {
    if (cardRef.current) {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  }, []);
  
  return div(children, {
    ref: cardRef,
    className: `p-4 rounded-lg shadow-lg ${className}`
  });
}
```

### Using the Component

```atom
import AnimatedCard from './_components/AnimatedCard.atom';

@View {
  return div([
    AnimatedCard({ children: h2("Card 1") }),
    AnimatedCard({ children: h2("Card 2") }),
    AnimatedCard({ children: h2("Card 3") })
  ]);
}
```

## Best Practices

### 1. Import Only What You Need

```atom
// ✅ Good - Tree-shaking works
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ❌ Avoid - Imports entire library
import * as gsap from 'gsap';
```

### 2. Use useEffect for Client-Side Libraries

```atom
@View {
  const elementRef = useRef(null);
  
  useEffect(() => {
    // Client-side only code
    if (typeof window !== 'undefined' && elementRef.current) {
      // Initialize library
      gsap.to(elementRef.current, { opacity: 1 });
    }
  }, []);
  
  return div("Content", { ref: elementRef });
}
```

### 3. Clean Up Resources

```atom
useEffect(() => {
  const animation = gsap.to(elementRef.current, { x: 100 });
  
  // Cleanup
  return () => {
    animation.kill();
  };
}, []);
```

### 4. Check for Browser Environment

```atom
useEffect(() => {
  if (typeof window === 'undefined') return;
  
  // Client-side only code
  gsap.to(element, { opacity: 1 });
}, []);
```

## Common Libraries

### Animation

- **GSAP** - Professional animation library
  ```bash
  npm install gsap
  ```

- **Anime.js** - Lightweight animation
  ```bash
  npm install animejs
  ```

### UI Components

- **Headless UI** - Unstyled components
  ```bash
  npm install @headlessui/react
  ```

- **React Icons** - Icon library
  ```bash
  npm install react-icons
  ```

### Utilities

- **Lodash** - Utility functions
  ```bash
  npm install lodash
  ```

- **date-fns** - Date utilities
  ```bash
  npm install date-fns
  ```

### Charts

- **Chart.js** - Charting library
  ```bash
  npm install chart.js
  ```

### Forms

- **Zod** - Schema validation
  ```bash
  npm install zod
  ```

## Examples

### GSAP Timeline

```atom
import { gsap } from 'gsap';

@View {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (containerRef.current) {
      const tl = gsap.timeline();
      
      tl.from(containerRef.current.children[0], {
        opacity: 0,
        y: 50,
        duration: 0.5
      })
      .from(containerRef.current.children[1], {
        opacity: 0,
        x: -50,
        duration: 0.5
      }, "-=0.25")
      .from(containerRef.current.children[2], {
        opacity: 0,
        scale: 0.8,
        duration: 0.5
      }, "-=0.25");
    }
  }, []);
  
  return div([
    h1("Title"),
    p("Subtitle"),
    button("Click me")
  ], { ref: containerRef });
}
```

### Chart.js Integration

```atom
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@View {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  
  useEffect(() => {
    if (canvasRef.current && !chartRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar'],
          datasets: [{
            label: 'Sales',
            data: [12, 19, 3]
          }]
        }
      });
    }
    
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);
  
  return canvas(null, { ref: canvasRef });
}
```

### Three.js Integration

```atom
import * as THREE from 'three';

@View {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    
    renderer.setSize(400, 400);
    containerRef.current.appendChild(renderer.domElement);
    
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    camera.position.z = 5;
    
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();
    
    sceneRef.current = { scene, camera, renderer };
    
    return () => {
      if (renderer) renderer.dispose();
    };
  }, []);
  
  return div(null, { ref: containerRef, className: "w-96 h-96" });
}
```

## Troubleshooting

### Library Not Found

If you get "module not found" errors:

1. **Install the package:**
   ```bash
   npm install package-name
   ```

2. **Check import path:**
   ```atom
   // ✅ Correct
   import { gsap } from 'gsap';
   
   // ❌ Wrong
   import gsap from 'gsap/dist/gsap';
   ```

### SSR Issues

Some libraries only work client-side:

```atom
@View {
  useEffect(() => {
    // Only runs on client
    if (typeof window !== 'undefined') {
      // Use library here
    }
  }, []);
}
```

### Bundle Size

Large libraries increase bundle size. Consider:

1. **Dynamic imports:**
   ```atom
   useEffect(() => {
     import('heavy-library').then(lib => {
       // Use library
     });
   }, []);
   ```

2. **Code splitting:**
   - Use libraries only where needed
   - Import specific functions, not entire library

## Next Steps

- [API Reference](./API_REFERENCE.md) - Complete API documentation
- [Components Guide](./GETTING_STARTED.md#components) - Building components
- [Hooks Guide](./API_REFERENCE.md#hooks) - Using hooks with libraries
