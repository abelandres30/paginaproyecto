
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
/*firebase */
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';


const routes: Routes = [
  {path: '', component: ModuloregistroComponent},
  {path: 'modulomenu', component: ModulomenuComponent},
  {path: 'moduloconfiguracion', component: ModuloconfiguracionComponent},
  {path: 'moduloforoproblemas', component: ModuloforoproblemasComponent},
  {path: 'moduloxbox', component: ModuloxboxComponent},
  {path: 'modulowii', component: ModulowiiComponent},
  {path: 'problemapc', component: ProblemapcComponent},
  {path: 'modulomensajes', component: ModulomensajesComponent},
  {path: 'moduloproyectos', component: ModuloproyectosComponent},

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
    AngularFireStorageModule
  ],
  providers: [RespuestasService,
    CookieService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
