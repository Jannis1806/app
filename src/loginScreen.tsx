import { Composite, ScrollView, TextInput, TextView, ImageView, Button, app, ActivityIndicator, contentView } from "tabris";
import { bind, component } from "tabris-decorators";
import { App } from "./App";

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
          <TextView right={24} textColor='blue' highlightOnTouch>Neu registrieren</TextView>
        </Composite>
        <Composite top='prev()' stretchX>
          <Button centerX  top='prev() 64' text='Einloggen' onSelect={() => this.login()} />
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

  private async login(){   
    $('#loginActivity').first().excludeFromLayout=false;

    // const request = new Request('http://archiv.dpsg-gladbach.de:3000/api/user', 
    // {
    //   method: 'GET',
    //   headers:
    //     { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imphbm5pc211ZWxsZXIyMDAxQGdtYWlsLmNvbSIsInVzZXJJZCI6IjIyZjRiOTY5LTU3YzctNGM0OS1iZGY2LWJhZDM5MjE4MzRjYiIsImlhdCI6MTY1MzM4ODA4NywiZXhwIjoxNjUzOTkyODg3fQ.YOy8o-JP8pyaTUeGfJiC_ysiZqz4KLnKUq3fD_mIvqk'}
    // });

    const loginInformation = 
      {
        email: this.email,
        password: this.password
      };

    const blob = new Blob([JSON.stringify(loginInformation, null, 2)], {type : 'application/json'});

    const request = new Request('http://api.dpsg-gladbach.de:3000/auth/login', 
    {
      body: blob,
      method: 'POST',
      timeout: 5000
    });
  
    console.log(await request.clone().json());

    try {
      const response = await fetch(request);   
      // const response = await fetch('http://ip-api.com/json');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();   
      console.log(data);      
      this.app.openMainMenu();
    } catch (error) {
      console.log(error);
    }
    $('#loginActivity').first().excludeFromLayout=true;
    // xhr.onerror = (err) => console.log(err);

  }
}