from setuptools import setup, find_packages  
  
setup(  
    name="linkbuster-ai",  
    version="1.0.0",  
    packages=find_packages(),  
    install_requires=[  
        "flask==2.3.3",  
        "flask-cors==4.0.0",  
        "requests==2.31.0",  
        "numpy==1.26.4",  
        "pandas==2.2.2",  
        "scikit-learn==1.4.2",  
        "joblib==1.4.2",  
        "wtforms==3.1.2",  
        "python-dotenv==1.0.0"  
    ],  
    python_requires=">=3.8",  
) 
