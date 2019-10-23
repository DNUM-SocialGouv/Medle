import styled from "styled-components"
import { Button } from "reactstrap"

export const NewButton = styled.button`
   background: transparent;
   border-radius: 3px;
   border: 2px solid palevioletred;
   color: palevioletred;
   margin: 0 1em;
   padding: 0.25em 1em;
`

export const ValidationButton = styled(Button)`
   background: #307df6;
   border-radius: 0;
   border: 0;
   color: white;
   margin: 0 1em;
   padding: 0.25em 1.5em;
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
   letter-spacing: 0.7px;
   line-height: 15px;
   font-variant: small-caps;
`
