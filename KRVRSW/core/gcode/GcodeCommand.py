class GcodeCommand:
    def __init__(self, command=None, comment=None, globalParameters=None):
        self.command = command
        self.parametrs = {}
        self.comment = comment

        self.globalParameters = globalParameters
        if self.globalParameters == None:
            self.globalParameters = ["S", "F"]
            
    
    def addParametr(self, key, value):
        self.parametrs[str(key)] = str(value)
    
    def tryChangeGlobalParametr(self, key, value):
        if str(key) not in self.globalParameters:
            return
            
        if str(key) not in self.parametrs:
            self.parametrs[str(key)] = str(value)
        
    def make(self):
        string = ""
        if self.comment:
            string = ";" + str(self.comment) + "\n"
        
        if self.command:
            string += self.command

            for parametr in self.parametrs:
                string += " " + str(parametr) + str(self.parametrs[parametr])
            
            string += "\n"
        
        return string
