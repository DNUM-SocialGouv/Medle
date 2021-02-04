import { Button as RSButton, DropdownToggle as RSDropdownToggle } from "reactstrap"
import styled, { css } from "styled-components"

export const DropdownToggle = styled(RSDropdownToggle)`
  font-family: "Source Sans Pro";
  font-size: 14px;
  letter-spacing: -0.23px;
  line-height: 16px;
  text-align: center;
  min-height: 46px;

  background: white;
  color: #6c757d;

  ${(props) =>
    props.invert &&
    css`
      background: #6c757d;
      color: white;
    `}
`

export const AnchorButton = styled(RSButton)`
  border: 0;
  background-color: white;
  color: black;

  :hover {
    color: red;
    background-color: white;
    color: black;
    text-decoration: underline;
  }
`

export const Button = styled(RSButton)`
  font-family: "Source Sans Pro";
  font-size: 14px;
  letter-spacing: -0.23px;
  line-height: 16px;
  text-align: center;
  min-height: 46px;

  background: white;
  color: #6c757d;

  :hover {
    color: white;
    background: #7f8991;
  }

  ${(props) =>
    props.invert &&
    css`
      background: #6c757d;
      color: white;
    `}

  ${(props) =>
    props.primary &&
    css`
      border-color: #007bff;
      vbackground: white;
      color: #007bff;
    `}
`

export const ValidationButton = styled(Button)`
  background: #307df6;
  border-radius: 5px;
  border: 0;
  color: white;
  margin: 0 1em;
  padding: 0.1em 1.5em;
  font-family: "Source Sans Pro";
`
export const SmallButton = styled.button`
  background: #307df6;
  border-radius: 5px;
  border: 0;
  color: white;
  margin: 0 1em;
  padding: 0.1em 1em;
  font-family: "Source Sans Pro";
  min-height: 35px;
`
export const TabButton = styled(Button)`
  background: #307df6;
  border-radius: 5px;
  border: 0;
  color: white;
  margin: 0 1em;
  padding: 0.1em 1.5em;
  font-family: "Source Sans Pro";
`

export const Title1 = styled.h1`
  height: 26px;
  color: #212529;
  font-family: Evolventa;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: -0.3px;
  text-align: center;
`

export const Title2 = styled.h2`
  height: 24px;
  color: #212529;
  font-family: Evolventa;
  font-size: 18px;
  letter-spacing: -0.41px;
  text-align: center;
  font-weight: 400;
`

export const Label = styled.label`
  height: 24px;
  color: #212529;
  font-family: "Source Sans Pro";
  font-size: 14px;
  letter-spacing: 0.5px;
  line-height: 15px;
  font-variant: small-caps;
  margin-bottom: 0;
`
