// Selectores
const form = document.getElementById('form');
const contactList = document.getElementById('contact-list');
const inputName = document.getElementById('form-input-name');
const inputNumber = document.getElementById('form-input-number');
const errorMessages = document.querySelectorAll('#form-error-text');

// Expresiones regulares para validar nombre y número
const NAME_REGEX = /^[A-Z][a-z]*[ ][A-Z][a-z]{3,}[ ]{0,1}$/; 
const PHONE_REGEX = /^[0](412|424|414|426|416|212)[0-9]{7}$/; 

// Lista de contactos (se carga desde localStorage si existen)
let contacts = JSON.parse(localStorage.getItem('contacts')) || [];

// Mostrar input inválido y el mensaje de error
function showError(input, errorMessage) {
  input.classList.add('input-invalid');
  input.classList.remove('input-valid');
  errorMessage.style.display = 'block';
}

// Mostrar input válido y ocultar el mensaje de error
function hideError(input, errorMessage) {
  input.classList.add('input-valid');
  input.classList.remove('input-invalid');
  errorMessage.style.display = 'none';
}

// Función de validación para los input
function validateInput(input, regex, errorMessage) {
  if (!regex.test(input.value.trim())) {
    showError(input, errorMessage);
    return false;
  } else {
    hideError(input, errorMessage);
    return true;
  }
}

// Validación dinámica mientras el usuario escribe
inputName.addEventListener('input', () => {
  // Validar si el campo de nombre está vacío
  const isNameEmpty = inputName.value.trim() === '';
  if (isNameEmpty) {
    showError(inputName, errorMessages[0]); 
    return; // Detener validaciones adicionales
  } else {
    hideError(inputName, errorMessages[0]);
  }

  // Validación : formato del nombre es correcto
  const isNameFormatValid = validateInput(inputName, NAME_REGEX, errorMessages[1]);
  if (isNameFormatValid) {
    hideError(inputName, errorMessages[1]);
  }
});

inputNumber.addEventListener('input', () => {
  // Validación : formato del número es correcto
  const isNumberValid = validateInput(inputNumber, PHONE_REGEX, errorMessages[2]);
  if (isNumberValid) {
    hideError(inputNumber, errorMessages[2]);
  }

  // Verificar si el nombre sigue siendo válido y ocultar sus errores si lo es
  const isNameStillValid = NAME_REGEX.test(inputName.value.trim());
  if (isNameStillValid) {
    hideError(inputName, errorMessages[1]);
  }
});


// Envío del formulario
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const isNameValid = validateInput(inputName, NAME_REGEX, errorMessages[0]);
  const isNumberValid = validateInput(inputNumber, PHONE_REGEX, errorMessages[1]);

  if (isNameValid && isNumberValid) {
    // Agregar nuevo contacto a la lista
    const newContact = { name: inputName.value.trim(), phone: inputNumber.value.trim() };
    contacts.push(newContact);
    saveContactsToStorage(); // Guardar en localStorage
    renderContacts(); // Renderizar la lista
    form.reset();
    inputName.classList.remove('input-valid', 'input-invalid');
    inputNumber.classList.remove('input-valid', 'input-invalid');
  }
});

// Guardar contactos en el localStorage
function saveContactsToStorage() {
  localStorage.setItem('contacts', JSON.stringify(contacts));
}

// Renderizar contactos en la lista
function renderContacts() {
  // Limpiar el contenido actual de la lista
  contactList.innerHTML = '';

  // Mostrar contactos en la lista
  contacts.forEach((contact, index) => {
    // Crear elementos para el contacto
    const contactItem = document.createElement('li');
    contactItem.classList.add('contact-item');

    const contactName = document.createElement('input');
    contactName.classList.add('contact-text');
    contactName.value = contact.name;
    contactName.readOnly = true;

    const contactNumber = document.createElement('input');
    contactNumber.classList.add('contact-text');
    contactNumber.value = contact.phone;
    contactNumber.readOnly = true;

    // Botón para editar contacto
    const editButton = document.createElement('button');
    editButton.classList.add('edit-contact-btn');
    editButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
        <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
        <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
      </svg>
    `;

    editButton.addEventListener('click', () => {
      if (!editButton.classList.contains('editing')) {
          contactName.readOnly = false;
          contactNumber.readOnly = false;
          contactName.focus();
          editButton.classList.add('editing');
          editButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
              <path fill-rule="evenodd" d="M11.013 2.513a1.75 1.75 0 0 1 2.475 2.474L6.226 12.25a2.751 2.751 0 0 1-.892.596l-2.047.848a.75.75 0 0 1-.98-.98l.848-2.047a2.75 2.75 0 0 1 .596-.892l7.262-7.261Z" clip-rule="evenodd" />
            </svg>
          `;
      } else {
          const isValid = validateEditContact(contactName.value, contactNumber.value);
          if (!isValid) {
              alert("Por favor corrige los errores antes de guardar.");
              return;
          }
          contactName.readOnly = true;
          contactNumber.readOnly = true;
          editButton.classList.remove('editing');
          editButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
              <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
              <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
            </svg>
          `;
          // Actualizar contacto en la lista
          contacts[index].name = contactName.value;
          contacts[index].phone = contactNumber.value;
          saveContactsToStorage();
      }
  });
  
    //Funcion para validar despues del editado
    function validateEditContact(contactName, contactNumber) {
      const NAME_REGEX = /^[A-Z][a-z]*[ ][A-Z][a-z]{3,}[ ]{0,1}$/; 
      const PHONE_REGEX = /^[0](412|424|414|426|416|212)[0-9]{7}$/; 

      if (!NAME_REGEX.test(contactName)) {
        alert("El nombre es invalido");
        return false;
      }
      if (!PHONE_REGEX.test(contactNumber)) {
        alert ("El numero es invalido");
        return false;
      }
      return true;
    }
  ;

    // Botón para eliminar contacto
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-contact-btn');
    deleteButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
        <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z" clip-rule="evenodd" />
      </svg>
    `;
    deleteButton.addEventListener('click', () => {
      // Eliminar contacto de la lista
      contacts.splice(index, 1);
      saveContactsToStorage();
      renderContacts();
    });

    // Agregar elementos al li
    contactItem.appendChild(contactName);
    contactItem.appendChild(contactNumber);
    contactItem.appendChild(editButton);
    contactItem.appendChild(deleteButton);

    // Agregar el li a la lista
    contactList.appendChild(contactItem);
  });
}

// Cargar contactos al iniciar la página
document.addEventListener('DOMContentLoaded', renderContacts);