const swaggerOptions = {  
  swaggerOptions: {
    docExpansion: 'list',           
    defaultModelsExpandDepth: -1,   
    defaultModelExpandDepth: 1,     
    displayRequestDuration: true,   
    filter: false,                  
    layout: 'BaseLayout',  
    showExtensions: true,
    showCommonExtensions: true,
    deepLinking: true,         
    persistAuthorization: true,
    tagsSorter: 'alpha',       
    operationsSorter: function(a, b) {
      const methodOrder = { 'post': 1, 'get': 2, 'put': 3, 'delete': 4 };
      return methodOrder[a.get('method')] - methodOrder[b.get('method')];
    }  
  }  
};