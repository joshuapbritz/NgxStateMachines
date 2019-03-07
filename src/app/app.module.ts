import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AsExtendComponent } from './pages/as-extend/as-extend.component';

import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppComponent, AsExtendComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', component: AsExtendComponent },
      { path: '**', redirectTo: '/' },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
