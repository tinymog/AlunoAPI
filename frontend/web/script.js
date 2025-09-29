//const apiUrl = "https://localhost:7134/api/Aluno"; // ajuste a porta conforme sua API
const apiUrl = "https://localhost:44395/api/Aluno"; // ajuste a porta conforme sua API

// ---------- LISTAR ----------
async function carregarAlunos() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    const alunos = await response.json();

    const tbody = document.querySelector("#alunoTable tbody");
    tbody.innerHTML = "";

    if (alunos.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; padding: 20px; color: var(--text-secondary);">
            <i class="fas fa-users" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
            Nenhum aluno cadastrado
          </td>
        </tr>
      `;
      return;
    }

    alunos.forEach(aluno => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <div class="user-info">
            <div class="user-icon">
              <i class="fas fa-user"></i>
            </div>
            ${aluno.nome}
          </div>
        </td>
        <td>${aluno.email}</td>
        <td>${aluno.telefone}</td>
        <td>
          <div class="action-buttons">
            <button class="edit-btn" onclick="abrirModal('${aluno.id}', '${aluno.nome}', '${aluno.email}', '${aluno.telefone}')">
              <i class="fas fa-edit"></i> Editar
            </button>
            <button class="delete-btn" onclick="deletarAluno('${aluno.id}')">
              <i class="fas fa-trash"></i> Excluir
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("Erro ao carregar alunos:", error);
    mostrarMensagem("Erro ao carregar a lista de alunos. Verifique se a API está rodando.", "error");
  }
}

// ---------- CADASTRAR ----------
document.getElementById("alunoForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const telefone = document.getElementById("telefone").value;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, telefone })
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    e.target.reset();
    carregarAlunos();
    mostrarMensagem("Aluno cadastrado com sucesso!", "success");
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);
    mostrarMensagem("Erro ao cadastrar aluno. Tente novamente.", "error");
  }
});

// ---------- DELETAR ----------
async function deletarAluno(id) {
  if (!confirm("Deseja realmente excluir este aluno?")) return;

  try {
    const response = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    carregarAlunos();
    mostrarMensagem("Aluno excluído com sucesso!", "success");
  } catch (error) {
    console.error("Erro ao excluir aluno:", error);
    mostrarMensagem("Erro ao excluir aluno. Tente novamente.", "error");
  }
}

// ---------- EDITAR ----------
const modal = document.getElementById("editModal");
const span = document.querySelector(".close");

function abrirModal(id, nome, email, telefone) {
  modal.style.display = "block";
  document.getElementById("editId").value = id;
  document.getElementById("editNome").value = nome;
  document.getElementById("editEmail").value = email;
  document.getElementById("editTelefone").value = telefone;
}

span.onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target === modal) modal.style.display = "none"; };

document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("editId").value;
  const nome = document.getElementById("editNome").value;
  const email = document.getElementById("editEmail").value;
  const telefone = document.getElementById("editTelefone").value;

  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, nome, email, telefone })
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    modal.style.display = "none";
    carregarAlunos();
    mostrarMensagem("Aluno atualizado com sucesso!", "success");
  } catch (error) {
    console.error("Erro ao atualizar aluno:", error);
    mostrarMensagem("Erro ao atualizar aluno. Tente novamente.", "error");
  }
});

// ---------- FUNÇÃO PARA MOSTRAR MENSAGENS ----------
function mostrarMensagem(mensagem, tipo) {
  // Remove mensagens anteriores
  const mensagensAntigas = document.querySelectorAll('.status-message');
  mensagensAntigas.forEach(msg => msg.remove());
  
  // Cria nova mensagem
  const mensagemElement = document.createElement('div');
  mensagemElement.className = `status-message ${tipo}`;
  mensagemElement.textContent = mensagem;
  
  // Insere após o título principal
  const titulo = document.querySelector('h1');
  titulo.parentNode.insertBefore(mensagemElement, titulo.nextSibling);
  
  // Remove a mensagem após 5 segundos
  setTimeout(() => {
    mensagemElement.remove();
  }, 5000);
}

// ---------- Inicializar ----------
carregarAlunos();