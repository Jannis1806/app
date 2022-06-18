import { Composite, Button, drawer, AlertDialog, TextView, Page, Switch, Image, ImageView, NavigationView, Listeners } from "tabris";
import { property, ListView, Cell, ListViewSelectEvent } from 'tabris-decorators';
import { App } from "./App";
import { Getraenke } from "./getraenke";
import { LoginScreen } from './loginScreen';
import { MyPage } from "./mypage";


const CELL_FONT = {iOS: '17px', Android: 'medium 14px'}[device.platform];  
class menu {
  @property name: string;
  @property page: Page;
  @property text: string;
  @property active: boolean = true;
  @property image: Image;
}

export class MainMenu extends Composite{

  static id = 'MainMenu';

  example_menus = [
    { name: 'Seite 1', text: 'Das ist Seite 1', active: true}
  ];  
  menus: menu[] = [];
  
  constructor(
    private app: App
    ){
    super()
    this.right=0;
    this.left=0;
    this.top=0;
    this.bottom=0;
    this.id=MainMenu.id;

    this.initPages();
    this.activatePages();
    this.initDrawer()
    this.showNavigationView();
    
  }

  private showNavigationView(){  
    this.append(
      new NavigationView({
        id: MainMenu.id,
        layoutData: 'stretch',
        drawerActionVisible: true
      }).append(this.menus.filter((menu) => menu.active==true)[0].page)
    )
  }

  private activatePages(){    
    this.menus.forEach((menu) => { menu.active = (menu.page instanceof Getraenke) ? localStorage.getItem('showGetraenke') === 'true' : true});
    for (let menu of this.menus){
      console.log(menu.name + ' ' + menu.active);
    }
  }

  private initPages(){
    let pages: MyPage[] = []    
    pages.push(new Getraenke());
    for(let page of pages){
      this.menus.push({name: page.title, page: page, text: page.title, active: true, image: page.drawer_image});
    }
    
    this.example_menus.forEach((ex) => this.menus.push(
      {
        name: ex.name, 
        page: new Page({title: ex.name}).append(
        <$>
          <Switch checked={localStorage.getItem('showGetraenke') === 'true'} onSelect={() => this.switchChanged()}/>
          <Button left={16} right={16} top='prev() 16' stretchX>Create page in drawer</Button>
        </$>
        ),
        text: ex.text,
        active: ex.active,
        image: Image.from({src: 'icons/punkte.png'})
      }
      )
    );
  }

  private initDrawer(){
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
  
  private openLogoutDialog(){
    new AlertDialog({
      title: 'Ausloggen',
      message: 'Bist du dir sicher, dass du dich ausloggen willst?',
      buttons: {ok: 'Ausloggen', cancel: 'Abbrechen'}
    }).open()
    .onCloseOk(() => this.app.openScreen(LoginScreen.id ));
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