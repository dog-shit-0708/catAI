#!/usr/bin/env python3
"""
Simple framework test script
"""

import sys
import os

# Add project root to Python path
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

def test_imports():
    """Test basic imports"""
    print("Testing imports...")

    try:
        from src.core.config import settings
        print("Config loaded:", settings.app.name)

        from src.ai.factory import AIFactory
        print("AI Factory imported")

        from src.services.ai_service import AIService
        print("AI Service imported")

        return True
    except Exception as e:
        print("Import failed:", e)
        return False

def main():
    print("Cat AI Backend Framework Test")
    print("=" * 40)

    if test_imports():
        print("All tests passed! Framework is working.")
        return 0
    else:
        print("Tests failed.")
        return 1

if __name__ == "__main__":
    sys.exit(main())