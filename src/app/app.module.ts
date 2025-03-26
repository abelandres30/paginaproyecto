
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { HttpModule } from '@angular/http';
import { RespuestasService } from './services/cuentas.service';
import { AppComponent } from './app.component';
import { ModuloregistroComponent } from './pages/registro/moduloregistro.component';
import { ModulomenuComponent } from './pages/menuprincipal/modulomenu.component';
import { HeaderComponent} from './pages/header/header.component';
import { Routes, RouterModule } from '@angular/router';
import { ModuloconfiguracionComponent } from './pages/configuracion/moduloconfiguracion.component';
import { ModuloforoproblemasComponent } from './pages/foroproblemas/moduloforoproblemas.component';
import { ModulomensajesComponent } from './pages/mensajes/modulomensajes.component';
import { ModuloproyectosComponent } from './pages/proyectos/moduloproyectos.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { UsuariorecomendadosComponent } from './pages/usuariorecomendados/usuariorecomendados.component';
import { ComponenteforoproblemasComponent } from '../app/components/componenteforoproblemas/componenteforoproblemas.component';
import { ComponenteforoproyectosComponent } from '../app/components/componenteforoproyectos/componenteforoproyectos.component';
import { ComponentepublicacionesComponent } from './components/componentepublicaciones/componentepublicaciones.component';

/*firebase */
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule} from '@angular/fire/database';

// servicios
import { RegistroPublicacionService } from './services/registropublicacion.service';
import { ObtenerPublicacionService } from './services/publicaciones.service';
import { ChatComponent } from './components/chat/chat.component';
import { AutenticationService } from './services/autentication.service';
import { AuthGuard } from './guards/auth.guard';
import { AmigosComponent } from './pages/amigos/amigos.component';
import { HeaderNavComponent } from './pages/header-nav/header-nav.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LoadingComponent } from './ComponentesExtras/loading/loading.component';
import { LoadingPrincipalComponent } from './ComponentesExtras/animacionCargando/loadingPrincipal.component';

const routes: Routes = [
  { path: '', component: ModuloregistroComponent, canActivate: [AuthGuard] },
  { path: 'modulomenu', component: ModulomenuComponent, canActivate: [AuthGuard]},
  { path: 'moduloconfiguracion', component: ModuloconfiguracionComponent, canActivate: [AuthGuard] },
  { path: 'moduloforoproblemas', component: ModuloforoproblemasComponent, canActivate: [AuthGuard] },
  { path: 'modulomensajes', component: ModulomensajesComponent, canActivate: [AuthGuard] },
  { path: 'moduloproyectos', component: ModuloproyectosComponent,  canActivate: [AuthGuard]},
  { path: 'amigos', component: AmigosComponent,  canActivate: [AuthGuard]},
  { path: 'perfil/:id', component: PerfilComponent, canActivate: [AuthGuard]},

  { path: '**', redirectTo: '/' }
];

@NgModule({
  declarations: [
    AppComponent,
    ModuloregistroComponent,
    ModulomenuComponent,
    HeaderComponent,
    ModuloconfiguracionComponent,
    ModuloforoproblemasComponent,
    ModulomensajesComponent,
    ModuloproyectosComponent,
    UsuariorecomendadosComponent,
    ComponenteforoproblemasComponent,
    ComponenteforoproyectosComponent,
    ComponentepublicacionesComponent,
    ChatComponent,
    AmigosComponent,
    HeaderNavComponent,
    PerfilComponent,
    LoadingComponent,
    LoadingPrincipalComponent,
  ],

  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireDatabaseModule,
    NgbModule,
  ],

  providers: [
    AutenticationService,
    AuthGuard,
    RespuestasService,
    CookieService,
    RegistroPublicacionService,
    ObtenerPublicacionService,
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
