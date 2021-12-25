
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
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { UsuariorecomendadosComponent } from './pages/usuariorecomendados/usuariorecomendados.component';
/*firebase */
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule} from '@angular/fire/database';


// servicios
import { RegistroPublicacionService } from './services/registropublicacion.service';
import { RegistroproblemaService } from './services/registroproblema.service';
import { ObtenerPublicacionService } from './services/publicaciones';
import { RegistrousuarioService } from './services/registrousuario.service';
import { NotificacionesService } from './services/notificaciones.service';
import { ChatComponent } from './components/chat/chat.component';
import { AutenticationService } from './services/autentication.service';
import {AuthGuard } from './guards/auth.guard';
import { BiografiausuComponent } from './pages/biografiausu/biografiausu.component';
import { AmigosComponent } from './pages/amigos/amigos.component';
import { HeaderNavComponent } from './pages/header-nav/header-nav.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LoadingComponent } from './ComponentesExtras/loading/loading.component';

const routes: Routes = [
  {path: '', component: ModuloregistroComponent},
  {path: 'modulomenu', component: ModulomenuComponent, canActivate: [AuthGuard]},
  {path: 'moduloconfiguracion', component: ModuloconfiguracionComponent, canActivate: [AuthGuard]},
  {path: 'moduloforoproblemas', component: ModuloforoproblemasComponent, canActivate: [AuthGuard]},
  {path: 'modulomensajes', component: ModulomensajesComponent, canActivate: [AuthGuard]},
  {path: 'moduloproyectos', component: ModuloproyectosComponent, canActivate: [AuthGuard]},
  {path: 'biografiausu', component: BiografiausuComponent, canActivate: [AuthGuard]},
  {path: 'amigos', component: AmigosComponent, canActivate: [AuthGuard]},
  {path: 'perfil/:id', component: PerfilComponent, canActivate: [AuthGuard]},
  
  {path: '**', component: ModuloregistroComponent}
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
    ChatComponent,
    BiografiausuComponent,
    AmigosComponent,
    HeaderNavComponent,
    PerfilComponent,
    LoadingComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MessageModule,
    MessagesModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,   
    AngularFireDatabaseModule,
    NgbModule,


  ],
  providers: [AutenticationService,
    AuthGuard,
    RespuestasService,
    CookieService,
    RegistroPublicacionService,
    RegistroproblemaService,
    ObtenerPublicacionService,
    RegistrousuarioService,
    NotificacionesService,


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
