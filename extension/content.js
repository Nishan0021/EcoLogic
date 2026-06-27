// Content script to detect and autofill form fields on scholarship portals

// Flag the page to let the React app know the extension is active
document.documentElement.setAttribute('data-scholarmate-extension', 'active');
window.dispatchEvent(new CustomEvent('ScholarMateExtensionLoaded'));

// Heuristic matching function for form inputs
function findField(keywords) {
  const inputs = document.querySelectorAll('input, select');
  
  for (const input of inputs) {
    // 1. Check ID, name, placeholder, autocomplete attributes
    for (const attr of ['id', 'name', 'placeholder', 'autocomplete', 'class']) {
      const val = (input.getAttribute(attr) || '').toLowerCase();
      if (keywords.some(keyword => val.includes(keyword))) {
        return input;
      }
    }
    
    // 2. Check associated label elements
    if (input.id) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) {
        const text = label.textContent.toLowerCase();
        if (keywords.some(keyword => text.includes(keyword))) {
          return input;
        }
      }
    }
    
    // 3. Check parent element text (often labels wrap inputs)
    let parent = input.parentElement;
    for (let depth = 0; depth < 3 && parent; depth++) {
      const text = parent.textContent.toLowerCase();
      if (keywords.some(keyword => text.includes(keyword)) && parent.querySelector('input, select') === input) {
        // Double check that text belongs to label-like structures
        if (text.length < 150) {
          return input;
        }
      }
      parent = parent.parentElement;
    }
  }
  return null;
}

// Function to fill value and dispatch events so React/Angular/Vue portal forms detect changes
function fillValue(input, value) {
  if (!input) return false;
  
  if (input.tagName === 'SELECT') {
    // Select dropdown option matching value or text
    const options = Array.from(input.options);
    const bestOption = options.find(opt => 
      opt.value.toLowerCase() === value.toLowerCase() || 
      opt.text.toLowerCase().includes(value.toLowerCase())
    );
    if (bestOption) {
      input.value = bestOption.value;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    return false;
  }
  
  // Text inputs
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  input.dispatchEvent(new Event('blur', { bubbles: true }));
  
  // Highlight filled field briefly
  const originalBorder = input.style.border;
  input.style.border = '2px solid #10b981';
  input.style.backgroundColor = '#ecfdf5';
  setTimeout(() => {
    input.style.border = originalBorder;
    input.style.backgroundColor = '';
  }, 1500);
  
  return true;
}

// Helper to dynamically inject a vault file into a file input using HTML5 DataTransfer
async function injectFile(input, filename) {
  try {
    const fileUrl = `http://localhost:8080/uploads/${filename}`;
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("File fetch failed");
    
    const blob = await response.blob();
    const mimeType = blob.type || 'application/pdf';
    
    // Create HTML5 File object from blob data
    const file = new File([blob], filename, { type: mimeType });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    
    // Assign file array to input element
    input.files = dataTransfer.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Highlight input success
    input.style.outline = '2px solid #10b981';
    input.style.backgroundColor = '#ecfdf5';
    return true;
  } catch (err) {
    console.error(`Failed to inject file: ${filename}`, err);
    return false;
  }
}

// Find file input matching keywords
function findFileInput(keywords) {
  const fileInputs = document.querySelectorAll('input[type="file"]');
  for (const input of fileInputs) {
    const name = (input.name || '').toLowerCase();
    const id = (input.id || '').toLowerCase();
    const classes = (input.className || '').toLowerCase();
    
    if (keywords.some(k => name.includes(k) || id.includes(k) || classes.includes(k))) {
      return input;
    }
    
    // Search label if associated
    if (input.id) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label && keywords.some(k => label.textContent.toLowerCase().includes(k))) {
        return input;
      }
    }
  }
  return null;
}

// Listen for fill requests from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "autofill") {
    const profile = request.profile;
    let count = 0;
    
    // 1. Map standard text & select fields with expanded keywords
    const mappings = [
      { keys: ['name', 'full_name', 'fullname', 'applicant', 'first_name'], val: profile.name },
      { keys: ['gender', 'sex', 'select_gender'], val: profile.gender },
      { keys: ['state', 'domicile', 'residency', 'select_state'], val: profile.state },
      { keys: ['caste', 'category', 'social_category', 'select_category'], val: profile.category },
      { keys: ['income', 'family_income', 'annual_income', 'parent_income'], val: profile.income },
      { keys: ['score', 'gpa', 'percentage', 'marks', 'hsc_marks', 'ssc_marks'], val: profile.score },
      { keys: ['phone', 'mobile', 'contact', 'cellphone'], val: profile.phone || '' },
      { keys: ['email', 'email_address', 'mail_id'], val: profile.email || '' },
      
      // Common repetitive extra fields
      { keys: ['religion', 'minority'], val: profile.category === 'SC' || profile.category === 'ST' ? 'Hindu' : 'General' },
      { keys: ['first_gen', 'firstgen'], val: profile.firstGen || 'Yes' },
      { keys: ['bank', 'bank_name'], val: 'State Bank of India' },
      { keys: ['ifsc', 'ifsc_code'], val: 'SBIN0001234' },
      { keys: ['account', 'account_no', 'bank_account'], val: '30291039203' }
    ];
    
    mappings.forEach(map => {
      if (map.val) {
        const input = findField(map.keys);
        if (input && fillValue(input, map.val)) {
          count++;
        }
      }
    });
    
    // 2. Map and inject vault documents programmatically
    const docMappings = [
      { keys: ['aadhaar', 'uid', 'identity'], type: 'aadhaar' },
      { keys: ['income', 'salary_cert', 'income_cert'], type: 'income' },
      { keys: ['marksheet_12', 'marksheet', 'result_12', 'academic_cert'], type: 'marksheet_12' },
      { keys: ['domicile', 'address_proof', 'state_cert'], type: 'domicile' },
      { keys: ['caste', 'category_cert', 'caste_cert'], type: 'caste' }
    ];
    
    // We run async injection for files
    const filePromises = docMappings.map(async map => {
      const vaultDoc = (profile.vaultDocs || []).find(d => d.type === map.type);
      if (vaultDoc && vaultDoc.filename) {
        const fileInput = findFileInput(map.keys);
        if (fileInput) {
          const ok = await injectFile(fileInput, vaultDoc.filename);
          if (ok) count++;
        }
      }
    });
    
    // Wait for file injection and respond back
    Promise.all(filePromises).then(() => {
      sendResponse({ success: true, filledCount: count });
    });
    
    return true; // Keep message channel open for async response
  }
});
