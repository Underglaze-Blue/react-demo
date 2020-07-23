import React, {Component} from 'react'
import {fetchColors} from "../../api";
import {Colors, TupleColor} from '../../type'
import {colorsSort, rgb2hsv} from './utils'
import ICanvas from './canvas'
import styled from "styled-components";
import Loading from "../../components/loading";

interface IColorsProps {
  setBackgroundColor: (rgb: TupleColor<number, 3>) => void
}

interface IColorsState {
  colors: Array<Colors>
  Gray: number
}

const StyledUl = styled.ul`
  margin: 0 auto;
  width: 70vw;
  display: grid;
  grid-template-columns: repeat(auto-fill, calc(350px + 2vh));
  grid-gap: 10px;
  box-sizing: border-box;
  height: 80vh;
  overflow-y: auto;
  justify-content: space-around;
  background: rgba(255,255,255,.1);
  border-radius: 10px;
  transition: background-color 2s ease-in;
  &::-webkit-scrollbar {
    width: 0;
  }
  li{
   width: 100%;
   height: 110px;
   background: rgba(255,255,255,.2);
   margin: 2vh 0;
   padding: 0 1vh;
   border-radius: 5px;
   transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1), background-color 2s ease-in;
   transform: scale(1);
   cursor: pointer;
   .title{
      transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
      transform: scale(1);
   }
   &:hover{
    transform: scale(1.05);
    .title{
      transform: scale(1.15);
    }
   }
  }
`

const StyledArticle = styled.article`
  display: flex;
  color: #ffffff;
  font-size: 14px;
  flex-direction: column;
`

const StyledInformation = styled.aside`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-around;
`

const StyledTitle = styled.strong`
  flex: 0 0 60%;
`

const StyledSection = styled.section`
  flex: 0 0 25px;
  height: 25px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, .5);
`

class ColorList extends Component<IColorsProps, IColorsState>{
  constructor(props: IColorsProps) {
    super(props)
    this.state = {
      colors: [],
      Gray: 0
    }
  }

  handleGetColors = () => {
    fetchColors().then(res => {
      const tempColors = colorsSort(res as Array<Colors>)
      const [r, g, b] = tempColors[0].RGB
      this.setState({
        colors: tempColors,
        Gray: (r * 30 + g * 59 + b * 11) / 100
      })
      this.props.setBackgroundColor(this.state.colors[0].RGB)
    })
  }

  handleClick = (rgb: TupleColor<number, 3>) => {
    this.props.setBackgroundColor(rgb)
    const [r, g, b] = rgb
    this.setState({
      Gray: (r * 30 + g * 59 + b * 11) / 100
    })
  }

  _renderColors = (colors: Array<Colors>): React.ReactElement[] => {
    return colors.map((item, index, arr) => {
      return (
        <li style={{backgroundColor: this.state.Gray > 180 ? 'rgba(0,0,0,.2)' : 'rgba(255,255,255,.2)'}} onClick={() => {this.handleClick(item.RGB)}} key={item.name + item.pinyin}>
          <ICanvas cmyk={item.CMYK} rgb={item.RGB} />
          <StyledArticle>
            <StyledInformation className="font-small">
              <span>RGB: {item.RGB.join(', ')}</span>
              <span>CMYK: {item.CMYK.join(', ')}</span>
              <span>HEX: {item.hex}</span>
            </StyledInformation>
            <StyledInformation className="title">
              <StyledTitle>
                <cite>{item.name} <span className="font-small">{item.pinyin.toLocaleUpperCase()}</span></cite>
              </StyledTitle>
              <StyledSection style={{backgroundColor: `rgb(${item.RGB.join(',')})`}}/>
            </StyledInformation>
          </StyledArticle>
        </li>
      )
    })
  }

  componentDidMount() {
    this.handleGetColors()
  }

  render() {
    return (
      !this.state.colors.length ? <Loading/> :
        <StyledUl style={{backgroundColor: this.state.Gray > 180 ? 'rgba(0,0,0,.1)' : 'rgba(255,255,255,.2)'}}>
          {this._renderColors(this.state.colors)}
          {/*<ICanvas cmyk={[255,255,255,255]} rgb={[255,255,255]}/>*/}
        </StyledUl>
    );
  }
}

export default ColorList
