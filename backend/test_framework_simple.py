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
        print(f"✓ Config loaded: {settings.app.name}")

        from src.ai.factory import AIFactory
        print(f"✓ AI Factory imported")

        from src.services.ai_service import AIService
        print(f"✓ AI Service imported")

        return True
    except Exception as e:
        print(f"✗ Import failed: {e}")
        return False

def test_ai_factory():
    """Test AI factory"""
    print("\nTesting AI Factory...")

    try:
        from src.core.config import settings
        from src.ai.factory import AIFactory

        # Test text AI creation
        text_config = settings.ai.text_model.__dict__
        text_ai = AIFactory.create_text_ai(text_config)
        print(f"✓ Text AI created: {type(text_ai).__name__}")

        # Test vision AI creation
        vision_config = settings.ai.vision_model.__dict__
        vision_ai = AIFactory.create_vision_ai(vision_config)
        print(f"✓ Vision AI created: {type(vision_ai).__name__}")

        return True
    except Exception as e:
        print(f"✗ AI Factory test failed: {e}")
        return False

def main():
    print("Cat AI Backend Framework Test")
    print("=" * 40)

    tests = [test_imports, test_ai_factory]
    passed = 0

    for test_func in tests:
        if test_func():
            passed += 1

    print(f"\nResults: {passed}/{len(tests)} tests passed")

    if passed == len(tests):
        print("All tests passed! Framework is working.")
        return 0
    else:
        print("Some tests failed.")
        return 1

if __name__ == "__main__":
    sys.exit(main())