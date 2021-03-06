import { Composite, ScrollView, TextInput, TextView, ImageView, Button, app, ActivityIndicator, contentView } from "tabris";
import { bind, component } from "tabris-decorators";
import { App } from "./App";
import { MainMenu } from "./mainmenu";
import { RegistrationScreen } from "./registration";

@component
export class LoginScreen extends Composite{

  static id = 'loginScreen';

  @bind('#ti_email.text')
  email: string;
  @bind('#ti_password.text')
  password: string;

  constructor(
    private app: App
    ){
    super()
    this.right=0;
    this.left=0;
    this.top=0;
    this.bottom=0;
    this.id=LoginScreen.id;

    this.append(
      <ScrollView class='screen' stretch id={LoginScreen.id}>
        <Composite top={0} bottom='70%' stretchX>
          <ImageView center scaleMode='auto' onTap={() => this.openHomepage()} image={{src: 'icons/stammeswappen_animiert.png'}} tintColor='white'/>
        </Composite>   
        <Composite top='prev()' bottom='50%' stretchX>
          <TextView center text='Login' font={{size: 32}}/>
        </Composite>  
        <Composite top='prev()' stretchX>
          <TextInput id='ti_email' top='4' bottom='4' left={24} right={24} keepFocus message='Email-Adresse' keyboard='email'/>
        </Composite>  
        <Composite top='prev()' stretchX>
          <TextInput id='ti_password' top='4' bottom='4' left={24} right={24} keepFocus message='Passwort' type='password'/>
        </Composite>
        <Composite top='prev()' stretchX>
          <TextView left={24} textColor='blue' highlightOnTouch>Passwort vergessen?</TextView>
          <TextView right={24} textColor='blue' highlightOnTouch onTap={() => this.openRegistrationScreen()}>Neu registrieren</TextView>
        </Composite>
        <Composite top='prev()' stretchX>
          <Button centerX top='prev() 64' text='Einloggen' onSelect={() => this.login()}/>
        </Composite> 
      </ScrollView>  
    )
    contentView.append(
      <ActivityIndicator bottom='50%' left='45%' id={'loginActivity'} excludeFromLayout/>
      );
  }

  private openHomepage(){
    app.launch('https://www.dpsg-gladbach.de/')
  }

  private openRegistrationScreen(){
    this.app.openScreen(RegistrationScreen.id);
  }

  private async login(){   
    if (this.email == 'dev'){
      this.app.openScreen(MainMenu.id);
      return;
    }
    
    $('#loginActivity').first().excludeFromLayout=false;

    const loginInformation = 
      {
        email: this.email,
        password: this.password
      };

    const blob = new Blob([JSON.stringify(loginInformation, null, 2)], {type : 'application/json'});

    const request = new Request('http://api.dpsg-gladbach.de:3000/auth/login', 
    {
      body: blob,
      method: 'POST'
    });
  
    console.log('Login Request: ' + await request.clone().json());

    try {
      const response = await fetch(request);  
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();   
      console.log(data);      
      this.app.openScreen(MainMenu.id);
    } catch (error) {
      console.log(error);
    }
    $('#loginActivity').first().excludeFromLayout=true;

  }
}