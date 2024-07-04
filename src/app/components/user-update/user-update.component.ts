import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss'],
})
export class UserUpdateComponent implements OnInit {
  userId!: number;
  user!: User;
  updateForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private fb: FormBuilder,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id']; // Obtener el ID del usuario de la URL

    // Inicializar el formulario de actualización
    this.updateForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(8)], // Opcional: Validación personalizada para la contraseña
      role: ['User'], // Opcional: Valor predeterminado para el rol
      token: [''], // Opcional: No se muestra en el formulario
    });

    // Obtener los detalles del usuario por su ID
    this.apiService.getUserById(this.userId).subscribe((user) => {
      this.user = user;
      this.updateForm.patchValue(user); // Rellenar el formulario con los datos del usuario
    });
  }

  onSubmit() {
    if (this.updateForm.valid) {
      const updatedUser: User = this.updateForm.value;
      this.apiService.updateUser(this.userId, updatedUser).subscribe({
        next: () => {
          console.log('Usuario actualizado correctamente');
          this.toast.success({
            detail: 'SUCCESS',
            summary: 'Usuario actualizado exitosamente',
            duration: 5000,
          });
          // Opcional: Redirigir a otra página después de la actualización
        },
        error: (err) => {
          console.error('Error al actualizar usuario:', err);
          this.toast.error({
            detail: 'ERROR',
            summary: 'Error al actualizar usuario',
            duration: 5000,
          });
        },
      });
    } else {
      // Validación adicional, si se desea
    }
  }
}
