import { test } from "ava"
import { types } from "../src"

test("#158 - #88 - Identifiers should accept any string character", t => {
    const Todo = types.model("Todo", {
        id: types.identifier(types.string),
        title: types.string
    })
    t.notThrows(() => {
        ;["coffee", "cof$fee", "cof|fee", "cof/fee"].forEach(id => {
            Todo.create({
                id: id,
                title: "Get coffee"
            })
        })
    })
})

test("#187 - identifiers should not break late types", t => {
    t.notThrows(() => {
        const MstNode = types.model("MstNode", {
            value: types.number,
            next: types.maybe(types.late(() => MstNode))
        })
    })
})

test("should throw if multiple identifiers provided", t => {
    t.throws(() => {
        const Model = types.model("Model", {
            id: types.identifier(types.number),
            pk: types.identifier(types.number)
        })
        Model.create({ id: 1, pk: 2 })
    }, `[mobx-state-tree] Cannot define property 'pk' as object identifier, property 'id' is already defined as identifier property`)
})

test("should throw if identifier of wrong type", t => {
    t.throws(() => {
        const Model = types.model("Model", { id: types.identifier(types.number) })
        Model.create({ id: "1" })
    }, `[mobx-state-tree] Error while converting \`{\"id\":\"1\"}\` to \`Model\`:\nat path \"/id\" value \`\"1\"\` is not assignable to type: \`identifier(number)\` (Value is not a number), expected an instance of \`identifier(number)\` or a snapshot like \`identifier(number)\` instead.`)
})

test("identifier should be used only on model types - no parent provided", t => {
    t.throws(() => {
        const Model = types.identifier(types.number)
        Model.create(1)
    }, `[mobx-state-tree] Identifier types can only be instantiated as direct child of a model type`)
})
