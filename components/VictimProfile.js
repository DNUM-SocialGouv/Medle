import React from "react"
import ActBlock from "./ActBlock"
import PropTypes from "prop-types"
import { Title2 } from "./StyledComponents"
import { Col, Row } from "reactstrap"
import Counter from "./Counter"

const VictimProfile = ({ dispatch, state }) => {
   return (
      <>
         <ActBlock
            type="examinationTypes"
            title="Type(s) d'examen"
            values={["Somatique", "Psychiatrique", "Psychologique"]}
            mode="toggleMultiple"
            dispatch={dispatch}
            state={state.examinationTypes || []}
         />
         <ActBlock
            type="violenceTypes"
            title="Type(s) de violence"
            values={[
               "Conjugale",
               "Urbaine",
               "En réunion",
               "Scolaire",
               "Familiale",
               "Sur ascendant",
               "Agression sexuelle",
               { title: "Attentat", subValues: ["Bataclan", "Hyper Cacher"] },
            ]}
            mode="toggleMultiple"
            dispatch={dispatch}
            state={state.violenceTypes || []}
         />
         <Title2 className="mb-4 mt-5">{"Examens complémentaires"}</Title2>
         <Row>
            <Col>
               <Counter dispatch={dispatch} state={state} type={"bioExaminationsNumber"}>
                  Biologiques
               </Counter>
            </Col>
            <Col>
               <Counter dispatch={dispatch} state={state} type={"imagingExaminationsNumber"}>
                  Imageries
               </Counter>
            </Col>
            <Col>
               <Counter dispatch={dispatch} state={state} type={"othersExaminationNumber"}>
                  Autres
               </Counter>
            </Col>
         </Row>
      </>
   )
}

VictimProfile.propTypes = {
   dispatch: PropTypes.func.isRequired,
   state: PropTypes.object.isRequired,
}

export default VictimProfile
