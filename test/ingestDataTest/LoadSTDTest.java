package ingestDataTest;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;

import org.hadatac.data.loader.AnnotationWorker;
import org.hadatac.utils.ConfigProp;

public class LoadSTDTest extends StepTest{
	private static LoadSTDTest test = new LoadSTDTest();
	
	private LoadSTDTest() {}
	
	public static LoadSTDTest getTest()
	{
		return test;
	}

	@Override
	public void test() {
		//test not fully implemented, skip it.
		if(true)
			return;
		
		//put STD into unprocessed_csv
		try {
			Files.copy(java.nio.file.Paths.get("test/src/STD-2016-1432.csv"), java.nio.file.Paths.get(ConfigProp.getPathUnproc()+"/STD-2016-1432.csv"), StandardCopyOption.REPLACE_EXISTING);
		} catch (IOException e) {
			fail("Fail to copy STD from test/src to "+ConfigProp.getPathUnproc());
		}
		
		//process the STD
		AnnotationWorker.scan();
		AnnotationWorker.autoAnnotate();
		
		System.out.println("[Step 5] Process STD pass.");
		
		//check absence of STD in unprocessed_csv
		File stdUnprocessed = new File(ConfigProp.getPathUnproc()+"/STD-2016-1432.csv");
		assertTrue(ConfigProp.getPathUnproc()+"/STD-2016-1432.csv not deleted after loading STD", !stdUnprocessed.exists());
		
		//check existence of STD in processed_csv
		File stdProcessed = new File(ConfigProp.getPathProc()+"/STD-2016-1432.csv");
		assertTrue("Fail to detect "+ConfigProp.getPathProc()+"/STD-2016-1432.csv after loading STD", stdProcessed.exists());
		
		System.out.println("[Step 5] STD process file check pass.");
	}

	@Override
	public void preMsg() {
		System.out.println("[Step 5] Executing loadSTDTest:");
		
	}

	@Override
	public int step() {
		return 5;
	}
}
