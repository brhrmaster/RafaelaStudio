function prepareButtons() {
    const sidebar = document.querySelector(".sidebar");
    const closeBtn = document.querySelector("#btn");
    const searchBtn = document.querySelector(".bx-search");
    
    const menuBtnChange = () => {
        if (sidebar.classList.contains("open")) {
            closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
        } else {
            closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
        }
    };

    closeBtn.addEventListener("click",() => {
        sidebar.classList.toggle("open");
        menuBtnChange(); // chama a função (opicional)
    });

    searchBtn.addEventListener("click", () => {
        //sidebar abre quando clica no icone de pesquisar
        sidebar.classList.toggle("open");
        menuBtnChange(); 
        // chamando a função opcional
    });
    
    // document.querySelector('#btn').addEventListener('click', () => {
    //     document.querySelector('#sidebar').classList.toggle('open');
    // });
    //Retirar o código comentado para funcionar normalmente.
}

document.getElementById('log_out').onclick = function() {
    document.getElementById('log_outModal').style.display = 'block';
}

document.getElementById('closeModal').onclick = function() {
    document.getElementById('log_outModal').style.display = 'none';
}

document.getElementById('noButton').onclick = function() {
    document.getElementById('log_outModal').style.display = 'none';
}

document.getElementById('yesButton').onclick = function() {
    alert('Você saiu!'); // Aqui você pode adicionar a lógica de logout
    document.getElementById('log_outModal').style.display = 'none';
}

// Fecha o modal se o usuário clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('log_outModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}