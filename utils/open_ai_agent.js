import "../config/config.js"
import OpenAI from "openai";
import readLineSync from "readline-sync"


const client = new OpenAI({
    apiKey : process.env.OPEN_AI_AGENT_KEY
})

const makeDish = ([input])=>{
    if(input[0]=="panner" && input[1]=="onion"){
        return "Panner Tikka Masala, Panner Butter Masala, Panner Chilli"
    } 
    if(input[0]=="chicken" && input[1]=="onion"){
        return "Chicken Tikka Masala and Chicken 65"
    } 
    else 
        return "Potato curry"
}

const tools = {
    "makeDish" : makeDish
}

const SYSTEM_PROMPT = `
You are an AI Assistant with START, PLAN, ACTION, Observation and Output State.
Wait for the user prompt and first PLAN using available tools.
After Planning, Take the action with appropriate tools and wait for Observation based on Action.
Once you get the observations, Return the AI response based on START prompt and observations.

Strictly follow the JSON output format as in examples

Available Tools : 
- function makeDish(input : array[string]) : string
makeDish is a function that accepts array of ingredeints as input and return a dishes name that one can prepare from it 

Example:

START
{ "type": "user", "user": "What are the dishes that i can make using ingredeint 1. Panner 2. Onion?" }
{ "type": "plan", "plan": "I will call the function makeDish for Panner and Onion" }
{ "type": "action", "function": "makeDish", "input": "Panner" }
{ "type": "observation", "observation": "Panner Tikka Masala, Panner Butter Masala, Panner Chilli" }
{ "type": "output", "output": "The dishes you can make are Panner Tikka Masala, Panner Butter Masala and Panner Chilli " }

`;

const messages = [
    {role : "system" , content : SYSTEM_PROMPT}
]


while(true){
    const query = readLineSync.question(">> ");
    const q = {
        role : "user",
        user : query
    }
    messages.push({role : "user" , content : JSON.stringify(q) });
    while(true)
    {
        const chat = await client.chat.completions.create({
            model : "gpt-4o",
            messages : messages,
            response_format : {type : "json_object"}
        })

        const result = chat.choices[0].message.content;
        messages.push({role : "assistant" , content : result})

        const call = JSON.parse(result)

        if(call.type == "output")
        {
            console.log(call.output);
            break;
        } else if (call.type == "action")
        {
            const fn = tools[call.function];
            const observation = fn(call.input)
            const obs = { "type": "observation", "observation": observation }
            messages.push({role : "developer" , content : JSON.stringify(obs)})
        }
    }

}