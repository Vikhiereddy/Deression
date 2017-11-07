data = read.csv("/Library/WebServer/Documents/hackserver/data.csv")
tmp =read.csv("/Library/WebServer/Documents/hackserver/emotionData.csv")
emotionData <- tmp[["Feeling.Prevalence"]]
names(emotionData) = c("Sadness","Joy","Fear", "Disgust","Anger")
barplot(emotionData, main = "Emotional Distribution of Text",col=rgb(0.1,0.1,0.1,0.1), border="blue")
c <- data[[1]]
score <- data[["Score"]]
numChars <- data[["CharCount"]]
time <- as.POSIXct(c,format="%Y-%m-%dT%H:%M:%OS")
modified_score = numChars * score
plot(time,score,main="Mood Score over time",
     xlab="Date-Time", ylab = "Score")
smoothingSpline = smooth.spline(time,score, spar=.05)
lines(smoothingSpline)
plot(time,numChars, main="Number of Chars over time",
     xlab="Date-Time", ylab = "CharCounts")
smoothingSpline = smooth.spline(time,numChars, spar=.05)
lines(smoothingSpline)
plot(time,modified_score,main="Modified Mood Score over time",
     xlab="Date-Time", ylab = "Modified Score")
smoothingSpline = smooth.spline(time,modified_score, spar=.05)
lines(smoothingSpline)





