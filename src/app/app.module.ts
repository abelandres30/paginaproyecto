
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RespuestasService } from '../app/servicios/respuestas.service';
import { AppComponent } from './app.component';
import { ModuloregistroComponent } from './moduloregistro/moduloregistro.component';
import { ModulomenuComponent } from './modulomenu/modulomenu.component';
import { HeaderComponent} from './header/header.component';
import { Routes, RouterModule } from '@angular/router';
import { ModuloconfiguracionComponent } from './moduloconfiguracion/moduloconfiguracion.component';
import { ModuloforoproblemasComponent } from './moduloforoproblemas/moduloforoproblemas.component';
import { ModuloxboxComponent } from './moduloxbox/moduloxbox.component';
import { ModulowiiComponent } from './modulowii/modulowii.component';
import { ProblemapcComponent } from './problemapc/problemapc.component';
import { ModulomensajesComponent } from './modulomensajes/modulomensajes.component';
import { ModuloproyectosComponent } from './moduloproyectos/moduloproyectos.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { UsuariorecomendadosComponent } from './usuariorecomendados/usuariorecomendados.component';
import { ModulosdepublicacionesComponent } from './modulosdepublicaciones/modulosdepublicaciones.component';
/*firebase */
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

// servicios
import { RegistroPublicacionService } from './servicios/registropublicacion.service';
import { RegistroproblemaService } from './servicios/registroproblema.service';
import { ObtenerPublicacionService } from './servicios/obtenerpublicacion.service';
import { RegistrousuarioService } from './servicios/registrousuario.service';
import { NotificacionesService } from './servicios/notificaciones.service';
import { ChatComponent } from './components/chat/chat.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { AutenticationService } from './servicios/autentication.service';
  import {AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path: '', component: ModuloregistroComponent},
  {path: 'modulomenu', component: ModulomenuComponent, canActivate: [AuthGuard]},
  {path: 'moduloconfiguracion', component: ModuloconfiguracionComponent, canActivate: [AuthGuard]},
  {path: 'moduloforoproblemas', component: ModuloforoproblemasComponent, canActivate: [AuthGuard]},
  {path: 'moduloxbox', component: ModuloxboxComponent, canActivate: [AuthGuard]},
  {path: 'modulowii', component: ModulowiiComponent, canActivate: [AuthGuard]},
  {path: 'problemapc', component: ProblemapcComponent, canActivate: [AuthGuard]},
  {path: 'modulomensajes', component: ModulomensajesComponent, canActivate: [AuthGuard]},
  {path: 'moduloproyectos', component: ModuloproyectosComponent, canActivate: [AuthGuard]},
  {path: 'solicitudes', component: SolicitudesComponent, canActivate: [AuthGuard]},

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
    ModuloxboxComponent,
    ModulowiiComponent,
    ProblemapcComponent,
    ModulomensajesComponent,
    ModuloproyectosComponent,
    UsuariorecomendadosComponent,
    ModulosdepublicacionesComponent,
    ChatComponent,
    SolicitudesComponent,
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
