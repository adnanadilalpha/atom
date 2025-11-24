# Forms and Form Handling

ATOM Framework provides powerful form handling through Server Actions. This guide covers form creation, validation, and submission.

## Overview

ATOM supports:
- **Client-side forms** with Server Action submission
- **Form validation** (client and server)
- **File uploads**
- **Progressive enhancement**
- **Error handling**

## Basic Form

```atom
@Flow Actions {
  secure_submitForm: async function(data) {
    // Validate and process
    if (!data.name || data.name.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    
    // Save to database
    await DB.query(
      'INSERT INTO users (name, email) VALUES ($1, $2)',
      [data.name, data.email]
    );
    
    return { success: true };
  }
};

@View {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      await Actions.secure_submitForm({ name, email });
      setSubmitted(true);
      setName('');
      setEmail('');
    } catch (err) {
      setError(err.message);
    }
  };
  
  if (submitted) {
    return div("Form submitted successfully!");
  }
  
  return form([
    error && div(error, { className: "text-red-500 mb-4" }),
    
    input(null, {
      value: name,
      placeholder: "Name",
      oninput: (e) => setName(e.target.value),
      className: "w-full p-2 border rounded mb-2"
    }),
    
    input(null, {
      type: "email",
      value: email,
      placeholder: "Email",
      oninput: (e) => setEmail(e.target.value),
      className: "w-full p-2 border rounded mb-4"
    }),
    
    button("Submit", {
      type: "submit",
      className: "px-4 py-2 bg-blue-600 text-white rounded"
    })
  ], { onsubmit: handleSubmit });
}
```

## Form Validation

### Client-Side Validation

```atom
@View {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    try {
      await Actions.secure_submitForm(formData);
      // Success
    } catch (err) {
      setErrors({ submit: err.message });
    }
  };
  
  return form([
    errors.name && div(errors.name, { className: "text-red-500 text-sm" }),
    input(null, {
      value: formData.name,
      oninput: (e) => setFormData({ ...formData, name: e.target.value }),
      className: errors.name ? "border-red-500" : ""
    }),
    
    // ... more fields
  ], { onsubmit: handleSubmit });
}
```

### Server-Side Validation

```atom
@Flow Actions {
  secure_submitForm: async function(data) {
    // Comprehensive validation
    if (!data.name || typeof data.name !== 'string') {
      throw new Error('Name is required and must be a string');
    }
    
    if (data.name.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    
    if (data.name.length > 100) {
      throw new Error('Name must be less than 100 characters');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      throw new Error('Invalid email format');
    }
    
    // Process if valid
    return { success: true };
  }
};
```

## File Uploads

```atom
@Flow Actions {
  secure_uploadFile: async function(fileData) {
    // fileData contains: name, type, data (base64 or buffer)
    // Save to storage (S3, local, etc.)
    const filePath = await saveFile(fileData);
    return { path: filePath };
  }
};

@View {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    
    // Convert to base64 or FormData
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const result = await Actions.secure_uploadFile({
          name: file.name,
          type: file.type,
          data: e.target.result
        });
        alert('Uploaded: ' + result.path);
      } catch (err) {
        alert('Upload failed: ' + err.message);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };
  
  return div([
    input(null, {
      type: "file",
      onchange: handleFileChange,
      className: "mb-4"
    }),
    
    button(uploading ? "Uploading..." : "Upload", {
      onclick: handleUpload,
      disabled: !file || uploading
    })
  ]);
}
```

## Form Components

Create reusable form components:

```atom
// app/_components/FormInput.atom
@View {
  const { label, type = "text", value, placeholder, error, onChange, className = "" } = props || {};
  
  return div([
    label ? label(label, { className: "block text-sm font-medium mb-1" }) : null,
    
    type === "textarea" ?
      textarea(null, {
        value: value || '',
        placeholder: placeholder,
        oninput: (e) => onChange && onChange(e.target.value),
        className: `w-full p-2 border rounded ${error ? 'border-red-500' : ''} ${className}`
      }) :
      input(null, {
        type: type,
        value: value || '',
        placeholder: placeholder,
        oninput: (e) => onChange && onChange(e.target.value),
        className: `w-full p-2 border rounded ${error ? 'border-red-500' : ''} ${className}`
      }),
    
    error ? p(error, { className: "mt-1 text-sm text-red-600" }) : null
  ], { className: "mb-4" });
}
```

## Best Practices

### 1. Always Validate on Server

```atom
// ✅ Good - Server validation
secure_submitForm: async function(data) {
  if (!data.email) throw new Error('Email required');
  // ... process
}
```

### 2. Provide User Feedback

```atom
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [success, setSuccess] = useState(false);
```

### 3. Prevent Double Submission

```atom
const submittingRef = useRef(false);

const handleSubmit = async () => {
  if (submittingRef.current) return;
  submittingRef.current = true;
  // ... submit
  submittingRef.current = false;
};
```

### 4. Clear Form on Success

```atom
if (success) {
  setFormData({ name: '', email: '' });
  setErrors({});
}
```

## Examples

See [Form Example](../examples/form-example.atom) and [Contact Page](../app/contact.atom) for complete examples.

## Next Steps

- [Server Actions](./API_REFERENCE.md#server-actions) - Complete Server Actions reference
- [Validation](./AUTHENTICATION.md#password-security) - Input validation patterns
- [Error Handling](./STABILITY.md#error-handling) - Error handling best practices
