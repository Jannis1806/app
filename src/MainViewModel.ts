import { drawer } from 'tabris';
import {injectable, property} from 'tabris-decorators';

@injectable
export class MainViewModel {

  @property public message: string = '';
  status = 1;

  public continue() {
    if (this.status == 1){
      this.status = 0;
      this.message = 'Tabris.js rocks!';
      drawer.open();
    } else {
      this.status = 1;
      this.message = 'Tabris.js rocked!';
      drawer.close();
    }
  }

}
