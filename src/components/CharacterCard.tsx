import React, {useEffect} from 'react';
import {Button, Col, FormSelect, Row} from "react-bootstrap";
import {ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST} from "../consts";
import type {Attributes} from "../types";

interface CharacterCardProps {
    setSkillCheckResult: Function;
    characterIndex: number;
}

function CharacterCard(props: CharacterCardProps) {

    const {characterIndex, setSkillCheckResult} = props;

    const ATTRIBUTE_MAXIMUM = 70;
    const [attributeValues, setAttributeValues] = React.useState<Record<string, number>>({});
    const [classRequirements, setClassRequirements] = React.useState<Record<string, number>>();
    const [requirementsMetClasses, setRequirementsMetClasses] = React.useState<string[]>([]);
    const [skillValues, setSkillValues] = React.useState<Record<string, number>>({});
    const [skillPoints, setSkillPoints] = React.useState<number>(10);
    const [selectedSkill, setSelectedSkill] = React.useState(`${SKILL_LIST[0].name}:${SKILL_LIST[0].attributeModifier}`);
    const [dc, setDC] = React.useState<number>(0);

    const incrementAttribute = (attribute: string) => {
        let _attributeValues = attributeValues;
        if(!canIncrementAttribute(attribute)) {
            return;
        }
        if(!attributeValues.hasOwnProperty(attribute)) {
            _attributeValues[attribute] = 1;
            setAttributeValues({..._attributeValues});
            return;
        }
        _attributeValues[attribute]++;
        setAttributeValues({..._attributeValues});

    }
    const decrementAttribute = (attribute: string) => {
        let _attributeValues = attributeValues;
        if(!attributeValues.hasOwnProperty(attribute) || _attributeValues[attribute] <= 0) {
            _attributeValues[attribute] = 0;
            setAttributeValues({..._attributeValues});
            return;
        }
        _attributeValues[attribute]--;
        setAttributeValues({..._attributeValues});
    }

    const canIncrementAttribute = (attribute: string) => {
        const _attributeValueSum = Object.values(attributeValues).reduce((a, b) => a + b, 0);
        if(_attributeValueSum >= ATTRIBUTE_MAXIMUM){
            alert(`Sum of all attributes cannot be greater than ${ATTRIBUTE_MAXIMUM}}`);
            return false;
        }
        return true;
    }

    const canIncrementSkill = () => {
        const _skillSum = Object.values(skillValues).reduce((a, b) => a + b, 0);
        if(_skillSum >= skillPoints){
            alert(`Sum of all skills cannot be greater than ${skillPoints}`);
            return false;
        }
        return true;
    }

    const incrementSkill = (skill: string) => {
        if(!canIncrementSkill()){
            return false;
        }
        let _skillValues = skillValues;
        if(!skillValues.hasOwnProperty(skill)) {
            _skillValues[skill] = 1;
            setSkillValues({..._skillValues});
            return;
        }
        _skillValues[skill]++;
        setSkillValues({..._skillValues});
    }
    const decrementSkill = (skill: string) => {
        let _skillValues = skillValues;
        if(!skillValues.hasOwnProperty(skill)) {
            _skillValues[skill] = 0;
            setSkillValues({..._skillValues});
            return;
        }
        _skillValues[skill]--;
        setSkillValues({..._skillValues});
    }

    const canUseClass = (characterClass: Attributes): boolean => {
        let returnValue = true;
        Object.keys(characterClass).forEach(key => {
            if(!attributeValues[key] || (attributeValues[key] < characterClass[key])){
                returnValue = false;
            }
        });
        return returnValue;
    }

    const calculateSkillPoints = (intelligence: number) => {
        setSkillPoints(10 + ((intelligence || 0) * 4));
    }

    const characterRoll = () => {
        // 0 - name, 1 - attributeModifier
        const skill = selectedSkill.split(":");
        const skillValue = skillValues[skill[0]] || 0;
        const modifierValue = attributeValues[skill[1]] || 0;
        const roll = Math.floor(Math.random() * 21)

        setSkillCheckResult({
            characterIndex,
            skill,
            skillValue,
            modifierValue,
            dc,
            roll
        })
    }

    useEffect(() => {
        calculateSkillPoints(attributeValues["Intelligence"])
        let _requirementsMetClasses = [];
        Object.keys(CLASS_LIST).forEach((key) => {
            if(canUseClass(CLASS_LIST[key])){
                _requirementsMetClasses.push(key);
            }
        })
        setRequirementsMetClasses(_requirementsMetClasses);
    }, [attributeValues])

    return (
        <div className="border border-light border rounded p-5">
            <Row>
                <h1>Character {characterIndex}</h1>
            </Row>
            <Row>
                <h2>Skill Check</h2>
            </Row>
            <Row>
                <Col>
                    <label>
                        Skill:
                        <select onChange={(event) => setSelectedSkill(event.target.value)}>
                            {SKILL_LIST.map((skill) => {
                                return (
                                    <option value={`${skill.name}:${skill.attributeModifier}`} key={skill.name}>{skill.name}</option>
                                )
                            })}
                        </select>
                    </label>
                </Col>
                <Col>
                    <label className="m-2">
                        DC:
                        <input onChange={event => setDC(parseInt(event.target.value) || undefined)} type="text"/>
                    </label>
                </Col>
                <Col>
                    <Button onClick={characterRoll}>
                        Roll
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col className="border rounded border-light py-2 mx-2">
                    <h2>
                        Attributes
                    </h2>
                    <ul className="list-group">
                        {ATTRIBUTE_LIST.map((attribute) => {
                            return (
                                <li className="list-group-item" key={attribute}>
                                    {attribute}: {attributeValues[attribute] || 0}
                                    <Button className="m-1" onClick={() => incrementAttribute(attribute)}>+</Button>
                                    <Button className="m-1" onClick={() => decrementAttribute(attribute)}>-</Button>
                                </li>
                            )
                        })}
                    </ul>
                </Col>

                <Col className="border rounded border-light mx-2 py-2">
                    <h2>
                        Classes
                    </h2>
                    <ul className="list-group">
                        {Object.keys(CLASS_LIST).map((key) => {
                            return (
                                <li
                                    onClick={() => setClassRequirements(CLASS_LIST[key])}
                                    className={`list-group-item ${requirementsMetClasses.includes(key) ? "bg-success text-white": ""}`}
                                >
                                    {key}
                                </li>
                            )
                        })}
                    </ul>
                </Col>
                {classRequirements && (
                    <Col className="border rounded border-light mx-2 py-2">
                        <ul className="list-group">
                            {Object.keys(classRequirements).map((key) => {
                                return (
                                    <li className="list-group-item" key={key}>{key}: {classRequirements[key]}</li>
                                )
                            })}
                        </ul>
                        <Button className="m-1" onClick={() => setClassRequirements(undefined)}>Close requirements view</Button>
                    </Col>
                )}
                <Col className="border rounded border-light mx-2 py-2">
                    <h2>
                        Skills
                    </h2>
                    <p>Skill points to spend; {skillPoints}</p>
                    <ul className="list-group">
                        {SKILL_LIST.map((skill) => {
                            return (
                                <li className="list-group-item">
                                    {skill.name}: {skillValues[skill.name] || 0}
                                    (Modifier: {skill.attributeModifier}): {attributeValues[skill.attributeModifier] || 0}
                                    <Button className="m-1" onClick={() => incrementSkill(skill.name)}>+</Button>
                                    <Button className="m-1" onClick={() => decrementSkill(skill.name)}>-</Button>
                                    Total: {(skillValues[skill.name] || 0) + (attributeValues[skill.attributeModifier] || 0)}
                                </li>
                            )
                        })}
                    </ul>
                </Col>
            </Row>
        </div>
    );
}

export default CharacterCard;