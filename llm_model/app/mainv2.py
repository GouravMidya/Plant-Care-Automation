from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from langchain_core.tools import BaseTool
from langchain_core.language_models import BaseLanguageModel
from langchain_community.llms import Ollama
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field

class RouteInfo(BaseModel):
    """
    Structured representation of route information
    """
    route: str = Field(description="The frontend route path")
    description: str = Field(description="Helpful description to guide the user")
    action_needed: Optional[str] = Field(default=None, description="Any specific action user should take")


class RoutingTool(BaseTool):
    """
    Enhanced routing tool with detailed route information
    """
    name = "route_finder"
    description = "Finds the appropriate route path with detailed guidance"

    def _run(self, query: str) -> RouteInfo:
        """
        Determine the correct route with comprehensive information
        """
        routes = {
            "login": RouteInfo(
                route="/login", 
                description="Access your account or create a new one",
                action_needed="Please enter your credentials or sign up"
            ),
            "signup": RouteInfo(
                route="/signup", 
                description="Create a new account to access plant care features",
                action_needed="Fill out the registration form with your details"
            ),
            "dashboard": RouteInfo(
                route="/dashboard", 
                description="Your personal plant care management center",
                action_needed="View your devices, plants, and settings"
            ),
            "add device": RouteInfo(
                route="/dashboard/addDevice", 
                description="Add a new plant monitoring device to your account",
                action_needed="Enter device details and link to your account"
            ),
            "products": RouteInfo(
                route="/products", 
                description="Browse our range of plant care devices and accessories",
                action_needed="Explore and select products that suit your needs"
            ),
            "guides": RouteInfo(
                route="/guides", 
                description="Comprehensive plant care and maintenance guides",
                action_needed="Learn about plant care, troubleshooting, and best practices"
            ),
            "troubleshoot": RouteInfo(
                route="/troubleshoot", 
                description="Get help with plant health and device issues",
                action_needed="Describe your plant or device problem for targeted assistance"
            ),
            "tickets": RouteInfo(
                route="/tickets", 
                description="View and manage your support tickets",
                action_needed="Check ticket status or create a new support request"
            )
        }

        # Perform intelligent matching
        best_match = None
        max_match_score = 0

        for key, route_info in routes.items():
            # Calculate match score based on query similarity
            match_score = sum(word.lower() in query.lower() for word in key.split())
            
            if match_score > max_match_score:
                max_match_score = match_score
                best_match = route_info

        # If no good match found, return default route
        return best_match or RouteInfo(
            route="/", 
            description="Welcome to the main page. Let me help you navigate.",
            action_needed="Browse available options or use the search"
        )


class ChatRequest(BaseModel):
    message: str
    chat_history: List[Dict] = []


class PlantCareAssistant:
    def __init__(self):
        """
        Initialize Ollama LLM with system prompt and routing tool
        """
        # Initialize Ollama LLM
        self.llm = Ollama(model="llama3.2")

        # Routing tool
        self.routing_tool = RoutingTool()

        # System prompt with clear instructions
        self.system_prompt = """You are an expert AI assistant for a plant care automation website. 
        Your communication should be:
        - Concise and helpful
        - Directly address the user's query
        - Provide clear, actionable guidance
        - Use a friendly, supportive tone
        - Focus on solving the user's immediate need"""

    def generate_response(self, message: str, chat_history: List[Dict] = []) -> Dict:
        """
        Generate response and find appropriate route
        """
        # Find route first
        route_info = self.routing_tool.run(message)

        # Customize response generation based on route
        response_prompt = f"""Context: User is looking to navigate to {route_info.route}

            User Query: {message}

            Craft a helpful, concise response that:
            1. Acknowledges the user's intent
            2. Provides clear guidance
            3. Explains what they'll find on the page
            4. Suggests next steps

            Response format:
            - Start with a welcoming, direct statement
            - Explain the page's purpose
            - Give a clear, actionable suggestion"""

        # Generate response using Ollama
        response = self.llm.invoke(response_prompt)

        return {
            "response": response.strip(),
            "route": route_info.route,
            "route_description": route_info.description,
            "action_needed": route_info.action_needed
        }


class PlantExpertAssistant:
    def __init__(self):
        """
        Specialized assistant for Indian subcontinent plant care
        """
        self.llm = Ollama(model="llama3.2")
        self.system_prompt = """You are a plant care expert with in-depth knowledge of plants and gardening in the Indian subcontinent. 
        You provide advice on:
        - Local plants and crops
        - Soil conditions and climate suitability
        - Fertilizers and organic care
        - Seasonal care and pest management
        - Eco-friendly gardening practices
        Always be specific, culturally relevant, and practical in your advice."""

    def generate_response(self, message: str, chat_history: List[Dict] = []) -> Dict:
        """
        Generate plant domain-specific response
        """
        prompt = f"""System Instruction: {self.system_prompt}

        User Query: {message}

        Provide a helpful, culturally relevant response for gardening in the Indian subcontinent."""
        response = self.llm.invoke(prompt)

        return {"response": response.strip()}


# FastAPI Setup
app = FastAPI(title="Plant Care AI Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize assistants
plant_assistant = PlantCareAssistant()
plant_expert = PlantExpertAssistant()

@app.post("/navigate")
async def navigate_endpoint(request: ChatRequest):
    """
    Endpoint for website navigation assistance
    """
    result = plant_assistant.generate_response(
        request.message, 
        request.chat_history
    )
    return result


@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """
    Endpoint for plant domain expertise chat
    """
    result = plant_expert.generate_response(
        request.message, 
        request.chat_history
    )
    return result
