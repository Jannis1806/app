import { Composite, ScrollView, TextInput, TextView, ImageView, Button, app, ActivityIndicator, contentView } from "tabris";
import { bind, component } from "tabris-decorators";
import { App } from "./App";
import { MainMenu } from "./mainmenu";

@component
export class RegistrationScreen extends Composite{

  static id = 'RegistrationScreen';

  @bind('#ti_email.text')
  email: string;
  @bind('#ti_password.text')
  password: string;
  @bind('#ti_password_repeat.text')
  password_repeat: string;

  constructor(
    private app: App
    ){
    super()
    this.right=0;
    this.left=0;
    this.top=0;
    this.bottom=0;
    this.id=RegistrationScreen.id;

    this.append(
      <ScrollView class='screen' stretch id={RegistrationScreen.id}>
        <Composite top={0} bottom='70%' stretchX>
          <ImageView center scaleMode='auto' onTap={() => this.openHomepage()} image={{src: 'icons/stammeswappen_animiert.png'}} tintColor='white'/>
        </Composite>   
        <Composite top='prev()' bottom='50%' stretchX>
          <TextView center text='Registrierung' font={{size: 32}}/>
        </Composite>  
        <Composite top='prev()' stretchX>
          <TextInput id='ti_email' top='prev() 4' left={24} right={24} keepFocus message='Email-Adresse' keyboard='email'/>
          <TextInput id='ti_password' top='prev() 4'  left={24} right={24} keepFocus message='Passwort' type='password'/>
          <TextInput id='ti_password_repeat' top='prev() 4' left={24} right={24} keepFocus message='Passwort wiederholen' type='password'/>
        </Composite>
        <Composite top='prev()' stretchX>
          <Button centerX top='prev() 32' text='Registrieren' onSelect={() => this.register()}/>
        </Composite> 
      </ScrollView>  
    )
    contentView.append(
      <ActivityIndicator bottom='50%' left='45%' id={'registrationActivity'} excludeFromLayout/>
      );
  }

  private openHomepage(){
    app.launch('https://www.dpsg-gladbach.de/')
  }

  private async register(){   
    $('#loginActivity').first().excludeFromLayout=false;

    const registrationInformation = 
      {
        email: this.email,
        password: this.password,
        password_repeat: this.password_repeat
      };

    const blob = new Blob([JSON.stringify(registrationInformation, null, 2)], {type : 'application/json'});

    const request = new Request('http://api.dpsg-gladbach.de:3000/auth/register', 
    {
      body: blob,
      method: 'POST'
    });
  
    console.log('Registration Request: ' + await request.clone().json());

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
    $('#registrationActivity').first().excludeFromLayout=true;

  }
}