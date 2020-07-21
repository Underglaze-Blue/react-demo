import React, { Component, FormEvent } from 'react'
import { Input, Badge } from 'antd'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import {StyledButton} from './style'
import actions from '../../store/actionCreators'
import {fetchRandomImage} from '../../api'
import {ImageResult} from '../../models'
import { connect } from 'react-redux'
import {IHelloProps, IHelloState} from "./type";

class Create extends Component<IHelloProps, IHelloState> {
  constructor(props: IHelloProps) {
    super(props)
    this.state = {
      message: props.message,
      count: props.count as number,
      loading: false
    }
  }
  static defaultProps = {
    message: 'defaultMessage',
    count: 0
  }
  handleChange = (e: FormEvent<HTMLInputElement>) => {
    this.setState({
      message: (e.target as HTMLInputElement).value
    })
  }
  handleButtonClick = (type: boolean | null) => {
    const { count } = this.state
    if (type) {
      this.setState({
        loading: true
      })
      fetchRandomImage().then(res => {
        const {img} = res as ImageResult
        this.props.AddImage(img)
      }).finally(() => {
        this.setState({
          loading: false,
          count: count + 1
        })
      })
      return
    }
    this.setState({
      count: count - 1
    })
    this.props.RemoveImage()
  }
  render() {
    return (
      <article>
        <h1 className="color-white">{this.state.message}{this.state.count >= 5 && '🐂🍺'}...</h1>
        <Badge showZero count={this.state.count}>
          <h2 className="color-white">Button click count..</h2>
        </Badge>
        <aside style={{display: "flex"}}>
          <StyledButton type="primary" danger disabled={this.state.count <= 0} onClick={() => {
            this.handleButtonClick(false)
          }}>
            <MinusOutlined />
          </StyledButton>
          <Input value={this.state.message} placeholder="React demo ..." allowClear maxLength={10} type="text" onChange={this.handleChange}/>
          <StyledButton loading={this.state.loading} disabled={this.state.count >= 9} type="primary" onClick={() => {
            this.handleButtonClick(true)
          }}>
            <PlusOutlined style={{display: this.state.loading ? 'none' : ''}} />
          </StyledButton>
        </aside>
      </article>
    )
  }
}

export default connect(state => state, actions)(Create)
