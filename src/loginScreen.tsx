import { Composite, ScrollView, TextInput, TextView, ImageView, Button, contentView, app } from "tabris";
import { App } from "./App";

export class LoginScreen {

  static id = 'loginScreen';

  constructor(
    private app: App
  ){
    contentView.append(
      <ScrollView class='screen' stretch id={LoginScreen.id}>
        <Composite top={0} bottom='70%' stretchX>
          <ImageView center scaleMode='auto' onTap={() => this.openHomepage()} image={{src: 'icons/stammeswappen_animiert.png'}} tintColor='white'/>
        </Composite>   
        <Composite top='prev()' bottom='50%' stretchX>
          <TextView center text='Login' font={{size: 32}}/>
        </Composite>  
        <Composite top='prev()' stretchX>
          <TextInput top='4' bottom='4' left={24} right={24} keepFocus message='Email-Adresse' keyboard='email'/>
        </Composite>  
        <Composite top='prev()' stretchX>
          <TextInput top='4' bottom='4' left={24} right={24} keepFocus message='Passwort' type='password'/>
        </Composite>
        <Composite top='prev()' stretchX>
          <TextView left={24} textColor='blue' highlightOnTouch>Passwort vergessen?</TextView>
          <TextView right={24} textColor='blue' highlightOnTouch>Neu registrieren</TextView>
        </Composite>
        <Composite top='prev()' stretchX>
          <Button centerX  top='prev() 64' text='Einloggen' onSelect={() => this.app.openMainMenu()} />
        </Composite> 
      </ScrollView>  
    )
  }

  private openHomepage(){
    app.launch('https://www.dpsg-gladbach.de/')
  }

}