import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import axios from 'axios';
import Error from './Error';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class Security extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      sapID: '',
      rowIndex: '',
      modalIsOpen: false,
      modalDelete: false,
      dropdownOpen: false,
      rol: '',
      error: '',
      columns: [
      {
        dataField: 'sapId',
        text: 'SAP ID',
        sort: true,
        filter: textFilter()
      },
      {
        dataField: 'email',
        text: 'Email',
        sort: true,
        filter: textFilter(),
        editable: false
      }, 
      {
        dataField: 'employeeName',
        text: 'Name',
        sort: true,
        filter: textFilter(),
        editable: false
      },
      {
        dataField: 'batchNumber',
        text: 'BatchNumber',
        sort: true,
        filter: textFilter(),
        editable: false
      },
      {
        dataField: 'role',
        text: 'rol',
        sort: true,
        filter: textFilter()
      },
      {
        dataField: 'actions',
        text: 'Actions',
      },
      ]
    };
    
    this.onAdmin = this.onAdmin.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModalDelete = this.openModalDelete.bind(this);
    this.toggle = this.toggle.bind(this);
    this.select = this.select.bind(this);

  }
   
   componentWillMount() {
      axios.get("http://www.react-lalovar.c9users.io/getUsers")
      .then(response => {
          //console.log("response data" , response.data[0].role);
            for(let index = 0 ;index < response.data.length ; index ++){
              //console.log("Data Users", response.data[index]);
              response.data[index].role == 1 ?  response.data[index].role = 'Administrador' : response.data[index].role = 'User' ;
              //console.log('IndexRow',this.state.IndexRow);
              this.state.rowIndex = index;
            }
            this.setState({
              users:  response.data
            });
      });
   }
  
   
   openModal() {
    this.setState({modalIsOpen: true});
    console.log('Modal SapId');
   }
   
   openModalDelete() {
     this.setState({modalDelete: true});
    console.log('Modal SapId');
   }
   
   closeModal() {
    this.setState({modalIsOpen: false, modalDelete: false});
   }
   
   onTodoChange(value){
        this.setState({
             sapID: value
        });
   }
    
   toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
   }
   
   handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
   }
  
   select(event) {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
      rol: event.target.innerText
    });
   }
   
   

   onAdmin = (e,row) =>  {
        //debugger;
        //e.preventDefault();
        console.log("Administrador");
        console.log("row: " , row);
        console.log("after: " +this.state.sapID);
        //console.log("after Rol:" , this.state.rol);
        let roles = this.state.rol;
        roles == 'Administrador' ? roles = '1': roles = '2'; //Update
        const userToChange = {
          sapId: this.state.sapID,
          role: roles 
        };
        //SetState Modal
        
        console.log('UserToChange', userToChange);
        console.log('this.state.sapID', this.state.sapID);
        console.log('this.state.rol', this.state.rol);
        axios.post("http://www.react-lalovar.c9users.io/updateUserRol", userToChange )
         .then(res => {
            console.log('ant', this.state.users);
            console.log('resData', res.data)
            this.setState({
              modalIsOpen: false
            })
            if(res.data  == "ok") {
              let newUsers = this.state.users;
              for(let i =0; i<newUsers.length; i++){
                console.log("user: " + newUsers[i].sapId + "|"+ this.state.sapID);
                if(newUsers[i].sapId == this.state.sapID){
                  newUsers[i].role =this.state.rol;
                }
              }
              
              this.setState({
                  error: '',
                  users: newUsers
                });
                  
                console.log('suc', this.state.users);
            }
           else{
              console.log('Error');
                 this.setState ({
                 error: true,
                 errorDescription: res.data + ", check your information and try it again!"
                 });
                 //this.clearForm();
            }
          })
          .catch(error => {
            this.setState ({
              error: true,
              errorDescription: "Verify your internet connection!"
            });
          });
   }

   onDelete = (e, row)=>  {
        
        //e.preventDefault();
        console.log("Delete");
        console.log('Delete e', e);
        console.log('Index', row);
        console.log("after: " +this.state.sapID);
        const userToDelete = {
          sapId: this.state.sapID,
        };
        axios.post("http://www.react-lalovar.c9users.io/deleteUserInfo", userToDelete )
        .then(res => {
           if(res.data  == "ok") {
             console.log('resData',res.data)
             let users = this.state.users;
             console.log('users', users);
             let newUsers = [...users.slice(0, row), ...users.slice(row + 1)];
            console.log('newUsers',newUsers);
              this.setState(
                {users: newUsers,modalDelete: false}
              );
              
            }
            else{
                 this.setState ({
                 error: true,
                 errorDescription: res.data + ", check your information and try it again!"
                 }); 
            }
          })
          .catch(error => {
            console.log("error", error);
            this.setState ({
              error: true,
              errorDescription: "Verify your internet connection!"
            });
          });
          
          
          
   }
  
   render() {
     
     
      let rowEvents = {
            onClick: (e, row, rowIndex) => {
            console.log(`clicked on row with index: ${rowIndex}`, row['sapId']);
              this.setState({
                  sapID : row['sapId'],
                  rol : row['role'],
                  rowIndex: rowIndex
              })
            }
       };
      
      let style ={marginLeft : '55%', marginTop: '-40%'};
      const error = this.state.error;
      let id = this.state.sapID;
      let row = this.state.rowIndex;
      let resultado;
     
       if(error) {
        resultado = <Error mensaje ={this.state.errorDescription}/>
       }

       let data = this.state.users.map((user, row) => {
       let jsx =  <div>
                     <button className="btn btn-primary" onClick={this.openModal}/*onClick={e => this.onAdmin(e, index)}*/>
                       <i className="fa fa-edit"></i>
                     </button>
                     <button  style = {style} className="btn btn-danger" onClick={this.openModalDelete}>
                       <i className="fa fa-trash"></i>
                     </button>
                  </div>;
          return {
            ...user,
            actions: jsx
          };
       });
    
      
   
     return (
       <div>
         <div>
             <Modal
                isOpen={this.state.modalIsOpen}
                contentLabel="Example Modal"
                >
                 <ModalBody>
                   <h2>Edit Information!</h2>
                   <p>Sap Id</p>
                   <input type ="text" value= {this.state.sapID} onChange={e => this.onTodoChange(e.target.value)}></input>
                   <p>Rol</p>
                    <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                      <DropdownToggle caret>{this.state.rol}</DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem onClick={this.select}>User</DropdownItem>
                          <DropdownItem onClick={this.select}>Administrador</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                 </ModalBody>
                 <ModalFooter>
                    <Button onClick={e => this.onAdmin(e, row)} color="success">
                      Save
                    </Button>
                    <Button onClick={this.closeModal} color="danger">
                      Cancel
                    </Button>
                 </ModalFooter>
             </Modal>
             <Modal
                isOpen={this.state.modalDelete}
                contentLabel="Example Modal"
                >
                 <ModalBody>
                   <h4>Are you sure you want to delete this user?</h4>
                 </ModalBody>
                 <ModalFooter>
                    <Button onClick={e => this.onDelete(e, row)} color="success">
                      Yes
                    </Button>
                    <Button onClick={this.closeModal} color="danger">
                      No
                    </Button>
                 </ModalFooter>
             </Modal>
         </div>
         <div style={{ marginTop: 50 }}>
           <BootstrapTable 
             striped
             hover
             keyField='batchNumber' 
             data={ data }
             rowEvents={ rowEvents }
             columns={ this.state.columns } 
             pagination={ paginationFactory()}
             filter={ filterFactory() }
           />
         </div>
       </div>
    );
  }
 }

export default Security;