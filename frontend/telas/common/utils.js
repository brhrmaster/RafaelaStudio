document.querySelector('form').addEventListener('submit', function(event) {
    // Check that the email address is in the correct format
    var company = document.querySelector('#company').value;
    if (!company.includes('@')) {
      alert('Preencher os campos obrigatórios.');
      event.preventDefault();
    }

    var representative = document.querySelector('#representative').value;
    if (!representative.includes('@')) {
        alert('Preencher os campos obrigatórios.');
        event.preventDefault();
    }

    var phone = document.querySelector('#phone').value;
    if (!phone.includes('@')) {
        alert('Preencher os campos obrigatórios.');
        event.preventDefault();
    }
  
  });

  const btnSaveStock = document.getElementById('btn-save-stock');
    const manageStockModal = new bootstrap.Modal(document.getElementById('manageStockModal'));

    btnSaveStock.addEventListener('click', () => {
      manageStockModal.hide();
      const selectedRow = document.querySelector('.table-row');
          if (inputQuantity.value) {
        // Handle entry option
        selectedRow.children[4].textContent = '5 CL : 10 CS de 20';
        manageStockModal.show();
      } else {
        // Handle exit option
        manageStockModal.hide();
      }
    });