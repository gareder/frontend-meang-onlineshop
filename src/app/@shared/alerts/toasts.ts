import Swal from 'sweetalert2';
import { TYPE_ALERT } from './values.config';

export function basicAlert(icon = TYPE_ALERT.SUCCESS, title: string = '') {
  Swal.fire({
    title,
    icon,
    toast: true,
    position: 'top',
    showConfirmButton: true,
    timer: 2000,
    timerProgressBar: true
  });
}
