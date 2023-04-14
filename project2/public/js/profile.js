const inventoryFormHandler = async (event) => {
    event.preventDefault();
  
    const inventoryname = document.querySelector('#inventory-name').value.trim();
    
  
    if (inventoryname) {
      const response = await fetch(`/api/inventory`, {
        method: 'POST',
        body: JSON.stringify({ name: inventoryname}),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        document.location.replace('/profile');
      } else {
        alert('Failed to add to inventory');
      }
    }
  };
  
  const delInv = async (event) => {
    if (event.target.hasAttribute('data-id')) {
      const id = event.target.getAttribute('data-id');
  
      const response = await fetch(`/api/inventory/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        document.location.replace('/profile');
      } else {
        alert('Failed to delete project');
      }
    }
  };
  
  const needsFormHandler = async (event) => {
    event.preventDefault();
  
    const needsname = document.querySelector('#need-name').value.trim();
    
  
    if (needsname) {
      const response = await fetch(`/api/needs`, {
        method: 'POST',
        body: JSON.stringify({ name: needsname}),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        document.location.replace('/profile');
      } else {
        alert('Failed to add to needs');
      }
    }
  };
  const delNeeds = async (event) => {
    if (event.target.hasAttribute('data-id')) {
      const id = event.target.getAttribute('data-id');
      
      const response = await fetch(`/api/needs/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        document.location.replace('/profile');
      } else {
        alert('Failed to delete project');
      }
    }
  };
  
  document
    .querySelector('.new-inventory-form')
    .addEventListener('submit', inventoryFormHandler);

    document
    .querySelector('.need-form')
    .addEventListener('submit', needsFormHandler)
  
    document
    .querySelector('.inventory-list')
    .addEventListener('click', delInv);

  document
    .querySelector('.needs-list')
    .addEventListener('click', delNeeds);
  