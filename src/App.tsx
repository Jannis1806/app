import { contentView, drawer, Composite, } from 'tabris';
import { LoginScreen } from './loginScreen';
import { MainMenu } from './mainmenu';
import { RegistrationScreen } from './registration';

export class App {

  screens: (Composite)[] = [];

  constructor(
  ) {};

  public start() { 

    //create all screens
    this.screens.push(new LoginScreen(this));
    this.screens.push(new MainMenu(this));
    this.screens.push(new RegistrationScreen(this));
    this.screens.forEach((screen) => contentView.append(screen));
    
    this.openScreen(LoginScreen.id);
  }

  public openScreen(screenId: string){
    drawer.close();

    //hide add screens
    this.screens.forEach((screen) => {
      screen.excludeFromLayout = true;
      console.log('Exclude screen: ' + screen.id);
    });

    //open correct screen
    let screenToOpen = this.screens.find((screen) => screen.id == screenId);
    screenToOpen.id == MainMenu.id ? drawer.enabled = true : drawer.enabled = false;
    screenToOpen.excludeFromLayout = false;
    console.log('Include screen: ' + screenToOpen.id);
  }

}


