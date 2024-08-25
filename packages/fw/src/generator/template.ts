export default (name: string, params: string, ext: string, debug: boolean = false) => `
<TaskOptions>
  <TaskOptions>
    <option name="arguments" value="${debug ? ' -d' : ''} w $FileDir$/$FileName$ $FileEncoding$ ${params}" />
    <option name="checkSyntaxErrors" value="true" />
    <option name="description" />
    <option name="exitCodeBehavior" value="ALWAYS" />
    <option name="fileExtension" value="${ext}" />
    <option name="immediateSync" value="true" />
    <option name="name" value="${name}" />
    <option name="output" value="$FileName$" />
    <option name="outputFilters">
      <array />
    </option>
    <option name="outputFromStdout" value="false" />
    <option name="program" value="fw" />
    <option name="runOnExternalChanges" value="false" />
    <option name="scopeName" value="Project Files" />
    <option name="trackOnlyRoot" value="false" />
    <option name="workingDir" value="$FileDir$" />
    <envs />
  </TaskOptions>
</TaskOptions>
`;
