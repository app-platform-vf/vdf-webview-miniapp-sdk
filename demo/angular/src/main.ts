import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import VConsole from 'vconsole';

new VConsole();

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
