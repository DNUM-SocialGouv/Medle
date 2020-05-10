import { transform, untransform } from "../../../models/users"

describe("transform", () => {
  it("should transform in a model entity", () => {
    const knexUser = {
      id: 2,
      first_name: "John",
      last_name: "Mc Lane",
      email: "john.mclane@proton.mail",
      role: "OPERATOR_ACT",
      hospital_id: 3,
    }

    expect(transform(knexUser)).toMatchSnapshot()
  })
})

describe("untransform", () => {
  it("should untransform in a Knex entity with an id and without a password", () => {
    const modelUser = {
      id: 1,
      firstName: "Marty",
      lastName: "Mac Fly",
      email: "marty.macfly@gmail.com",
      role: "REGIONAL_SUPERVISOR",
      scope: [{ id: 1 }, { id: 3 }, { id: 6 }],
      hospital: null,
    }

    expect(untransform(modelUser)).toMatchSnapshot()
  })
  it("should untransform in a Knex entity even without id and wih a password", () => {
    const modelUser = {
      id: 2,
      firstName: "Doc",
      lastName: "Brown",
      email: "doc.brown@yahoo.com",
      password: "12345678",
      role: "OPERATOR_ACT",
      hospital: 2,
    }

    expect(untransform(modelUser)).toMatchSnapshot()
  })
  it("should untransform in a Knex entity even without id and password", () => {
    const modelUser = {
      firstName: "Doc",
      lastName: "Brown",
      email: "doc.brown@yahoo.com",
      role: "OPERATOR_ACT",
      hospital: 2,
    }

    expect(untransform(modelUser)).toMatchSnapshot()
  })
})
