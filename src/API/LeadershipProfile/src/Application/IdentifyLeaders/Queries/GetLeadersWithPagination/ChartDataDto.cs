using LeadershipProfile.Domain.Entities;

namespace LeadershipProfile.Application.IdentifyLeaders.Queries.GetLeadersWithPagination;

public class ChartDataDto
{
    public ChartDataDto(string[] labels, int[] totalsBySchoolLevel)
    {
        Labels = labels;
        ChartDataset dataSet = new ChartDataset("", totalsBySchoolLevel, null);
        Datasets = [dataSet];
    }

    public ChartDataDto(string[] labels, int[][] totalsBySchoolLevelByProp)
    {
        Labels = labels;
        Datasets = totalsBySchoolLevelByProp.Select(x => new ChartDataset("", x, null)).ToArray();
        Datasets[1].BackgroundColor = "rgba(174, 210, 133, 0.5)";
        Datasets[2].BackgroundColor = "rgba(223, 109, 25, 0.5)";
    }

    public string[] Labels { get; set;} = {};
    public ChartDataset[] Datasets { get; set; }
}
public class ChartDataset 
{
    public ChartDataset(string label, int[] totalsBySchoolLevel, string? backgroundColor)
    {
        Label = label;
        Data = totalsBySchoolLevel;
        BackgroundColor = backgroundColor ?? "rgba(97, 142, 221, 0.5)";
    }
    public string? Label { get; set;}
    public string? BackgroundColor { get; set;}
    public int[] Data { get; set;} = {};

}
