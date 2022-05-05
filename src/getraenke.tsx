import { TextView, Button, Constraint, Image } from 'tabris';
import { MyPage } from './mypage';

export class Getraenke extends MyPage {

  i = 0;

  constructor(){
    super();
    this.title = 'Getränke';
    this.drawer_image = Image.from({src: 'icons/bierflasche.png'});

    this.append(
      <$>
        <TextView id='label' text = 'Button not pressed' centerX padding={16} bottom={Constraint.next} font={{size: 24}}/>
        <Button center onSelect={() => this.buttonPressed()}>Tap here</Button>
      </$>
    );
    this.onAppear(() => this.appear())
  }

  private appear(){
    this.i = 0;
    $(TextView).set({ text: `Button pressed ${this.i++} times.` });
  }

  private buttonPressed(){
    $(TextView).set({ text: `Button pressed ${this.i++} times.` });
  }
}
