import { EMAIL_PATTERN } from '@core/constants/regex';
import Swal from 'sweetalert2';
import { TYPE_ALERT } from './values.config';

const swalWithBasicOptions = (title: string, html: string) => Swal.mixin({
  title,
  html,
  focusConfirm: false,
  cancelButtonText: 'Cancel',
  showCancelButton: true,
});

export async function formBasicDialog(
  title: string,
  html: string,
  property: string
) {
  return await swalWithBasicOptions(title, html).fire({
    preConfirm: () => {
      const value = (document.getElementById('name') as HTMLInputElement).value;
      if (value) {
        return value;
      }
      Swal.showValidationMessage('You have to add a genre');
      return;
    },
  });
}

export async function userFormBasicDialog(
  title: string,
  html: string
) {
  return await swalWithBasicOptions(title, html).fire({
    preConfirm: () => {
      let error = '';
      const name = (document.getElementById('name') as HTMLInputElement).value;
      if (!name) {
        error += 'Name is required<br>';
      }
      const lastname = (document.getElementById('lastname') as HTMLInputElement).value;
      if (!lastname) {
        error += 'Lastname is required<br>';
      }
      const email = (document.getElementById('email') as HTMLInputElement).value;
      if (!email) {
        error += 'Email is required<br>';
      }
      if (!EMAIL_PATTERN.test(email)) {
        error += 'Invalid email format<br>';
      }
      const role = (document.getElementById('role') as HTMLInputElement).value;
      if (error !== '') {
        Swal.showValidationMessage(error);
        return;
      }
      return {
        name,
        lastname,
        email,
        role,
        birthday: new Date().toISOString()
      };
    }
  });
}

export async function optionsWithDetails(
  title: string,
  html: string,
  width: number | string,
  confirmButtonText: string,
  cancelButtonText: string
) {
  return await Swal.fire({
    title,
    html,
    width: `${width}px`,
    showCloseButton: true,
    showCancelButton: true,
    confirmButtonColor: '#6c757d',
    cancelButtonColor: '#dc3545',
    confirmButtonText,
    cancelButtonText
  }).then((result) => {
    if (result.isConfirmed) {
      console.log('Edit');
      return true;
    } else if (result.dismiss.toString() === 'cancel') {
      console.log('Block');
      return false;
    }
  });
}

export async function loadData(title: string, html: string) {
  Swal.fire({
    title,
    html,
    didOpen: () => {
      Swal.showLoading();
    }
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log('I was closed by the timer');
    }
  });
}


export const closeAlert = () => {
  Swal.close();
};

export const infoEventAlert = async (title: string, html: string, typeAlert: TYPE_ALERT = TYPE_ALERT.WARNING) => {
  return await Swal.fire({
    title,
    html,
    icon: typeAlert,
    preConfirm: () => {
      return true;
    }
  });
};
