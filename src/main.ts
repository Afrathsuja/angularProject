import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { UserTableComponent } from './app/user-table/users.component';

bootstrapApplication(UserTableComponent, appConfig)
  .catch((err) => console.error(err));
