// CRUD operations for servicios_tecnicos table (Supabase)
const API_TABLE = "servicios";

const $ = (sel) => document.querySelector(sel);
const tbody = $("#tablaServicios tbody");
const modal = $("#modal");
const form = $("#formServicio");
const openModalBtn = $("#openModal");
const cancelBtn = $("#cancelBtn");
const searchInput = $("#search");
const modalTitle = $("#modalTitle");

let editingId = null;

function showModal(open=true){
  modal.setAttribute("aria-hidden", open ? "false" : "true");
}

openModalBtn.addEventListener("click", () => {
  editingId = null;
  form.reset();
  modalTitle.textContent = "Nuevo Servicio";
  showModal(true);
});

cancelBtn.addEventListener("click", ()=> showModal(false));
modal.addEventListener("click", (e)=> { if (e.target === modal) showModal(false); });

searchInput.addEventListener("input", ()=> cargarServicios(searchInput.value));

async function cargarServicios(filter=""){
  tbody.innerHTML = "<tr><td colspan='8'>Cargando...</td></tr>";
  try{
    let q = supabase.from(API_TABLE).select("*").order("fecha_emision",{ascending:false});
    const { data, error } = await q;
    if(error) throw error;
    let lista = data || [];
    if(filter){
      const f = filter.toLowerCase();
      lista = lista.filter(item =>
        (item.cliente || "").toLowerCase().includes(f) ||
        String(item.numero).includes(f) ||
        (item.numero_serie || "").toLowerCase().includes(f)
      );
    }
    if(lista.length === 0){
      tbody.innerHTML = "<tr><td colspan='8'>No hay servicios</td></tr>";
      return;
    }
    tbody.innerHTML = "";
    lista.forEach(s => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(s.cliente)}</td>
        <td>${escapeHtml(s.celular)}</td>
        <td>${s.numero ?? ""}</td>
        <td>${s.fecha_emision ?? ""}</td>
        <td>${escapeHtml(s.numero_serie)}</td>
        <td>${formatMoney(s.costo)}</td>
        <td>${formatMoney(s.saldo)}</td>
        <td>
          <button class="btn" data-id="${s.id}" data-action="edit">Editar</button>
          <button class="btn" data-id="${s.id}" data-action="delete">Eliminar</button>
        </td>`;
      tbody.appendChild(tr);
    });
  }catch(err){
    console.error(err);
    tbody.innerHTML = "<tr><td colspan='8'>Error al cargar datos</td></tr>";
  }
}

function escapeHtml(str){ if(!str) return ""; return String(str).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }
function formatMoney(n){ if(n===null||n===undefined) return ""; return "$"+Number(n).toLocaleString(); }

tbody.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if(!btn) return;
  const id = btn.dataset.id;
  const action = btn.dataset.action;
  if(action === "edit") return abrirEdicion(id);
  if(action === "delete") return eliminarServicio(id);
});

async function abrirEdicion(id){
  try{
    const { data, error } = await supabase.from(API_TABLE).select("*").eq("id", id).single();
    if(error) throw error;
    const s = data;
    editingId = s.id;
    modalTitle.textContent = "Editar Servicio";
    form.id.value = s.id;
    form.cliente.value = s.cliente || "";
    form.descripcion.value = s.descripcion || "";
    form.estado.value = s.estado || "";
    form.celular.value = s.celular || "";
    form.numero.value = s.numero || "";
    form.fecha_emision.value = s.fecha_emision ? s.fecha_emision : "";
    form.numero_serie.value = s.numero_serie || "";
    form.costo.value = s.costo || "";
    form.saldo.value = s.saldo || "";
    form.marca.value = s.marca || "";
    showModal(true);
  }catch(err){
    console.error(err);
    alert("No se pudo cargar el servicio para editar.");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(form).entries());
  // Normalize numeric fields
  if(formData.costo) formData.costo = parseFloat(formData.costo);
  if(formData.saldo) formData.saldo = parseFloat(formData.saldo);
  if(formData.numero) formData.numero = parseInt(formData.numero);

  try{
    if(editingId){
      const { error } = await supabase.from(API_TABLE).update(formData).eq("id", editingId);
      if(error) throw error;
      editingId = null;
    }else{
      const { error } = await supabase.from(API_TABLE).insert([formData]);
      if(error) throw error;
    }
    showModal(false);
    form.reset();
    cargarServicios();
  }catch(err){
    console.error(err);
    alert("Error guardando datos.");
  }
});

async function eliminarServicio(id){
  if(!confirm("¿Eliminar este servicio?")) return;
  try{
    const { error } = await supabase.from(API_TABLE).delete().eq("id", id);
    if(error) throw error;
    cargarServicios();
  }catch(err){
    console.error(err);
    alert("Error eliminando.");
  }
}

// initial load
cargarServicios();
