import { contentView, drawer, NavigationView, Page, TextView, Composite, ImageView, Switch, Button, Image, AlertDialog, TextInput, ScrollView } from 'tabris';
import { property, ListView, Cell, ListViewSelectEvent } from 'tabris-decorators';
import { Getraenke } from './getraenke';
import { MyPage } from './mypage';

const CELL_FONT = {iOS: '17px', Android: 'medium 14px'}[device.platform];  

class menu {
  @property name: string;
  @property page: Page;
  @property text: string;
  @property active: boolean = true;
  @property image: Image;
}

export class App {

  example_menus = [
    { name: 'Seite 1', text: 'Das ist Seite 1', active: true},
    { name: 'Seite 2', text: 'Das ist Seite 2', active: true}
  ];  

  menus: menu[] = [];

  constructor(
  ) {
    this.example_menus.forEach((ex) => this.menus.push(
      {
        name: ex.name, 
        page: new Page({title: ex.name}).append(
        <$>
          <Switch checked={false} onSelect={() => this.switchChanged()}/>
          <Button left={16} right={16} top='prev() 16' stretchX>Create page in drawer</Button>
        </$>
        ),
        text: ex.text,
        active: ex.active,
        image: Image.from({src: 'icons/punkte.png'})
      }
    ));

    let pages: MyPage[] = [];
    pages.push(new Getraenke());
    for(let page of pages){
      this.menus.push({name: page.title, page: page, text: page.title, active: true, image: page.drawer_image});
    }

    this.menus.forEach((menu) => { menu.active = (menu.page instanceof Getraenke) ? localStorage.getItem('showGetraenke') === 'true' : true});
    for (let menu of this.menus){
      console.log(menu.name + ' ' + menu.active);
    }
  };

  public start() {    
    contentView.append(
      new NavigationView({
        id: 'mainNavigationView',
        layoutData: 'stretch',
        drawerActionVisible: true,
        excludeFromLayout: true
      }).append(this.menus[0].page)
    );
    drawer.enabled = true; 

    drawer.append(
      <$>
      <Composite stretchX height={128} background='linear-gradient(45deg, #0288d1 10%, #00dfff)'>
        <ImageView center image={{src: 'icons/stammeswappen_animiert.png'}} tintColor='white'/>
      </Composite>
      <ListView stretchX bottom top='prev() 8' items={this.menus} onSelect={(ev) => this.handleSelection(ev)}>
            <Cell itemCheck={(item: menu) => (item.active) } selectable padding={8} height={52}>
              <ImageView left={16} width={32} height={32} bind-image='item.image' centerY/>
              <TextView left={72} centerY font={CELL_FONT} textColor='#212121' bind-text='item.name'/>
            </Cell>
            <Cell itemCheck={(item: menu) => !item.active} />
      </ListView> 
      <Composite stretchX highlightOnTouch bottom={8} onTap={() => this.openLogoutDialog()} padding={8} height={52}>
        <ImageView left={16} width={32} height={32} image={{src: 'icons/logout.jpg'}} centerY/>
        <TextView left={72} centerY font={CELL_FONT} textColor='#212121' text='Ausloggen'/>
      </Composite>
      </$>
      );     
      
    contentView.append(
      <ScrollView stretch id='loginScreen' excludeFromLayout={true}>
        <Composite top={0} bottom='70%' stretchX highlightOnTouch>
          <ImageView center scaleMode='auto' image={{src: 'icons/stammeswappen_animiert.png'}} tintColor='white'/>
        </Composite>   
        <Composite top='prev()' bottom='50%' stretchX highlightOnTouch>
          <TextView center text='Login' font={{size: 32}}/>
        </Composite>  
        <Composite top='prev()' stretchX highlightOnTouch>
          <TextInput top='4' bottom='4' left={24} right={24} keepFocus message='Email-Adresse' keyboard='email'/>
        </Composite>  
        <Composite top='prev()' stretchX highlightOnTouch>
          <TextInput top='4' bottom='4' left={24} right={24} keepFocus message='Passwort' type='password'/>
        </Composite>
        <Composite top='prev()' stretchX highlightOnTouch>
          <TextView left={24} textColor='blue'>Passwort vergessen?</TextView>
          <TextView right={24} textColor='blue'>Neu registrieren</TextView>
        </Composite>
        <Composite top='prev()' stretchX highlightOnTouch>
          <Button centerX  top='prev() 64' text='Einloggen' onSelect={() => this.openMainMenu()} />
        </Composite>  
      </ScrollView>
      );   

    this.openLogInScreen();
  }

  private openLogInScreen(){
    drawer.close();
    drawer.enabled = false;
    $('#mainNavigationView').only().excludeFromLayout = true;
    $('#loginScreen').only().excludeFromLayout = false;
  }

  private openMainMenu(){
    drawer.enabled = true;
    $('#mainNavigationView').only().excludeFromLayout = false;
    $('#loginScreen').only().excludeFromLayout = true;
  }

  private openLogoutDialog(){
    new AlertDialog({
      title: 'Ausloggen',
      message: 'Bist du dir sicher, dass du dich ausloggen willst?',
      buttons: {ok: 'Ausloggen', cancel: 'Abbrechen'}
    }).open()
    .onCloseOk(() => this.openLogInScreen());
  }

  private switchChanged(){
    const switcher = $(Switch).only();
    this.menus.forEach((menu) => {
      menu.active = (menu.page instanceof Getraenke) ? switcher.checked : true
      console.log(menu.name + ' ' + menu.active)
      });
    drawer.find(ListView).only().refresh();
    localStorage.setItem('showGetraenke', (switcher.checked ? 'true' : 'false'));
  }

  private handleSelection(ev: ListViewSelectEvent<menu>) {
    this.showPage(ev.item.page);
  }

  private showPage(page: Page) {
    drawer.close();
    const navigationView = $(NavigationView).only();
    navigationView.pages().detach();
    navigationView.append(page);
  }
}


