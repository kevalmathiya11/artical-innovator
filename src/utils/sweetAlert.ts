import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


export function showSuccessAlert(title: string, text?: string) {
  return Swal.fire({
    icon: 'success',
    title,
    text,
  });
}

export function showErrorAlert(title: string, text?: string) {
  return Swal.fire({
    icon: 'error',
    title,
    text,
  });
}

export function showConfirmAlert(title: string, text?: string) {
  return Swal.fire({
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  });
}
export function showToast(message: string, icon: 'success' | 'error' | 'info' | 'warning') {
  return Swal.fire({
    toast: true,
    position: 'top-end', // Top-right
    icon,
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#fefefe',
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
}