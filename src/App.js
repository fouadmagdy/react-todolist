import React, { Component } from 'react';
// import { v1 as uuid } from 'uuid';
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import TodoList from './components/TodoList';
import TodoInput from './components/TodoInput';

export default class App extends Component {

  state = {
    items: [],
    id: '',
    item: '',
    editItem: false,
  }

  componentDidMount() {
    axios.get('https://todolist-reactjs2020.herokuapp.com/api/todolist').then(response => {
      console.log('response', response.data.todo)
      this.setState({ items: response.data.todo })
    }).catch(err => {
      console.log('err fetching lists', err)
    })

  }

  handleChange = (e) => {
    this.setState({
      item: e.target.value
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: this.state.id,
      title: this.state.item
    }
    const updatedItems = [...this.state.items, newItem]
    this.setState({
      items: updatedItems
    }, () => {
      if (!this.state.editItem) {
        this.setState({ editItem: false, item: '' })
        axios.post('https://todolist-reactjs2020.herokuapp.com/api/todolist', newItem).then(response => {
          console.log('post successful')
        }).catch(err => {
          console.log('err on posting', err)
        })
      } else if (this.state.editItem) {
        axios({
          method: 'patch',
          url: `https://todolist-reactjs2020.herokuapp.com/api/todolist/${this.state.id}`,
          data: { title: this.state.item }
        }).then(response => {
          console.log('updated successfult', response)
          this.setState({ editItem: false, item: '' })
        }).catch(err => {
          console.log('err on update', err)
        })
      }
    })
  }
  clearList = () => {
    this.setState({ items: [] })
  }
  handleDelete = (id) => {
    const filteredItems = this.state.items.filter(item => item.id !== id)
    this.setState({ items: filteredItems })

    axios.delete(`https://todolist-reactjs2020.herokuapp.com/api/todolist/${id}`).then(response => {
      console.log('deleted success', response)
    }).catch(err => {
      console.log('error while deleting', err)
    })
  }
  handleEdit = (id) => {
    const filteredItems = this.state.items.filter(item => item.id !== id)
    const selectedItems = this.state.items.find(item => item.id === id)
    this.setState({
      items: filteredItems,
      item: selectedItems.title,
      id: id,
      editItem: true,
    })
  }


  render() {

    return (
      <div className="container">
        <div className="row">
          <div className="col-10 mx-auto col-md-8 mt-5">
            <h3 className="text-capitalize text-center">Todo input</h3>
            <TodoInput item={this.state.item} handleChange={this.handleChange} handleSubmit={this.handleSubmit} edit={this.state.editItem} />
            <TodoList items={this.state.items} clearList={this.clearList} handleDelete={this.handleDelete} handleEdit={this.handleEdit} />
          </div>
        </div>
      </div>
    )
  }
}
