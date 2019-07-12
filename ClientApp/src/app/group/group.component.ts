import { Component, OnInit, Inject } from '@angular/core';
import { UserGroup, GroupInvitation, User } from 'radiks';
import { AuthProvider } from './../../drivers/AuthProvider';
import { group } from '@angular/animations';


@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  groupName = 'johnsmith2';
  groupId = 'c7c5a1578bb4-4cf6-9f45-8fceb14559d9';

  userToInvite = 'nicktee.id.blockstack';
  inviteId = '81f93b713689-4cb9-84af-1a89003d8ea7';

  

  constructor(
    @Inject('AuthProvider') private authProvider: AuthProvider,
  ) { }

  ngOnInit() {
    this.init();
  }

  async init(){
    //await User.createWithCurrentUser();
    //this.getMyGroups();
    //this.createGroup(this.groupName);
    // this.backupKeysToGaia();
    // await this.inviteUser(this.userToInvite, this.groupId);
    // await this.acceptInvite(this.inviteId);
  }

  async createGroup(name){
    let group = new UserGroup({ name: name });
    let resp = await group.create();
    console.log('created group', group, resp);
  }

  async getMyGroups(){
    const groups = await UserGroup.myGroups();
    console.log('myGroups => ', groups);
  }

  async inviteUser(userToInvite, groupId){
    let group = await UserGroup.findById(this.groupId);
    const usernameToInvite = userToInvite;
    let groups = JSON.parse(localStorage.getItem('GROUP_MEMBERSHIPS_STORAGE_KEY'))
    let groupLocalKey = groups.userGroups[groupId]; 
    let pk = groups.signingKeys[groupLocalKey];
    group.privateKey = pk;
    const invitation = await group.makeGroupMembership(usernameToInvite);
    this.inviteId = invitation._id;
    console.log('inite id => ', invitation._id); // the ID used to later activate an invitation
  }
  
  async acceptInvite(inviteId){
    const invitation = await GroupInvitation.findById(inviteId);
    let resp = await invitation.activate();
    console.log("invite resp=>", resp);
  }


  async backupKeysToGaia(){
    let groupKeys  = null;
    try{
      groupKeys = await this.authProvider.fetchGroupMembershipBackup();
    } catch(e){
      console.log("no keys saved in gaia");
    }

    try{
      await this.authProvider.backupGroupMemberships();
    } catch (e){
      await this.authProvider.setGroupMembership(groupKeys);
    }
    console.log('[GROUP_MEMBERSHIPS_STORAGE_KEY]', groupKeys);
  }


  putData(){

  }

  getData(){

  }


}
